import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../services/member.service';
import { BillService } from '../services/bill.service';
import { AllocationService } from '../services/allocation.service';
import { BillTypeService } from '../services/bill-type.service';
import { PaymentService } from '../services/payment.service';
import { Member } from '../models/member';
import { Bill } from '../models/bill';
import { Allocation } from '../models/allocation';
import { BillType } from '../models/bill-type';
import { FormsModule } from '@angular/forms';
import {Payment} from "../models/payment";
// forkJoin runs multiple HTTP calls at the same time and waits for all to finish
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-bills', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bills.component.html',
  styleUrls: ['./my-bills.component.css']
})
export class MyBillsComponent implements OnInit {
  // Data fetched from the backend
  currentUser: Member | null = null;
  bills: Bill[] = [];
  billTypes: BillType[] = [];
  myAllocations: Allocation[] = [];
  payments: Payment[] = [];

  // Controls the payment modal and holds its form data
  showPaymentModal = false;
  paymentAllocationId = '';
  selectedAllocationId = '';
  paymentBillTypeId = '';
  paymentAmount = 0;
  paymentError = '';

  // Injects all services needed by this component
  constructor(
    private memberService: MemberService,
    private billService: BillService,
    private allocationService: AllocationService,
    private billTypeService: BillTypeService,
    private paymentService: PaymentService,
  ) {}

  // Runs when the component loads — waits for current user then loads their data
  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      if (user) {
        this.currentUser = user;
        this.loadAll(user);
      }
    });
  }

  // Fetches all data needed for this page in parallel
  loadAll(user: Member) {
    forkJoin({
      bills: this.billService.getBillsByHousehold(user.householdId),
      billTypes: this.billTypeService.getBillTypes(),
      allocations: this.allocationService.getAllocationsByMember(user._id!),
      payments: this.paymentService.getPaymentsByMember(user._id!)
    }).subscribe(({ bills, billTypes, allocations, payments }) => {
      this.bills = bills;
      this.billTypes = billTypes;
      this.myAllocations = allocations;
      this.payments = payments;
    });
  }

  // Finds the bill type name for a given payment by tracing: payment → allocation → bill → bill type
  getBillTypeNameForPayment(payment: Payment): string {
    const alloc = this.myAllocations.find(a => a._id === payment.allocationId);
    const bill = alloc ? this.getBillForAllocation(alloc) : undefined;
    return bill ? this.getBillTypeName(bill.billTypeId) : 'Unknown';
  }

  // Looks up a bill type name by ID
  getBillTypeName(billTypeId: string): string {
    return this.billTypes.find(t => t._id === billTypeId)?.name ?? 'Unknown';
  }

  // Returns payments sorted by date, newest first
  get sortedPayments(): Payment[] {
    return [...this.payments].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
  }

  // Finds the bill that belongs to a given allocation
  getBillForAllocation(alloc: Allocation): Bill | undefined {
    return this.bills.find(b => b._id === alloc.billId);
  }

  // Returns only the allocations that aren't fully paid yet
  get unpaidAllocations(): Allocation[] {
    return this.myAllocations.filter(a => a.status !== 'paid');
  }

  // Calculates total amount owed across all the user's allocations
  get totalOwed(): number {
    return this.myAllocations.reduce((s, a) => s + a.amountOwed, 0);
  }

  // Calculates total amount paid across all the user's allocations
  get totalPaid(): number {
    return this.myAllocations.reduce((s, a) => s + a.amountPaid, 0);
  }

  // Calculates total still outstanding across all the user's allocations
  get totalOutstanding(): number {
    return this.myAllocations.reduce((s, a) => s + (a.amountOwed - a.amountPaid), 0);
  }

  // Returns the number of bills that still need to be paid
  get billsToPay(): number {
    return this.unpaidAllocations.length;
  }

  // Opens payment modal pre-filled with the selected allocation's details
  openPaymentModal(alloc: Allocation) {
    const bill = this.getBillForAllocation(alloc);
    this.selectedAllocationId = alloc._id!;
    this.paymentAllocationId = alloc._id!;
    this.paymentBillTypeId = bill?.billTypeId ?? '';
    this.paymentAmount = 0;
    this.paymentError = '';
    this.showPaymentModal = true;
  }

  onAllocationChange(id: string) {
    const alloc = this.myAllocations.find(a => a._id === id);
    if (!alloc) return;
    const bill = this.getBillForAllocation(alloc);
    this.paymentAllocationId = alloc._id!;
    this.paymentBillTypeId = bill?.billTypeId ?? '';
    this.paymentAmount = 0;
    this.paymentError = '';
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  // Validates the payment amount then submits it to the backend
  submitPayment() {
    const alloc = this.myAllocations.find(a => a._id === this.paymentAllocationId);
    if (!alloc) return;

    const owedCents = Math.round(alloc.amountOwed * 100);
    const paidCents = Math.round(alloc.amountPaid * 100);
    const paymentCents = Math.round(this.paymentAmount * 100);
    const outstandingCents = owedCents - paidCents;

    if (paymentCents <= 0) {
      this.paymentError = 'Amount must be greater than zero.';
      return;
    }
    if (paymentCents > outstandingCents) {
      this.paymentError = `Cannot exceed outstanding amount of €${(outstandingCents / 100).toFixed(2)}.`;
      return;
    }

    this.paymentService.createPayment({
      allocationId: this.paymentAllocationId,
      memberId: this.currentUser!._id!,
      amount: this.paymentAmount,
      paidAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.showPaymentModal = false;
        this.loadAll(this.currentUser!);
      },
      error: (err) => {
        this.paymentError = 'Error: ' + err.error?.message;
      }
    });
  }
}
