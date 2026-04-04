import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
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

@Component({
  selector: 'app-my-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bills.component.html',
  styleUrls: ['./my-bills.component.css']
})
export class MyBillsComponent implements OnInit {
  currentUser: Member | null = null;
  bills: Bill[] = [];
  billTypes: BillType[] = [];
  myAllocations: Allocation[] = [];
  payments: Payment[] = [];

  // Payment modal
  showPaymentModal = false;
  paymentAllocationId = '';
  paymentBillTypeId = '';
  paymentAmount = 0;
  paymentError = '';

  constructor(
    private memberService: MemberService,
    private billService: BillService,
    private allocationService: AllocationService,
    private billTypeService: BillTypeService,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      if (user) {
        this.currentUser = user;
        this.loadAll(user);
      }
    });
  }

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

  getBillTypeNameForPayment(payment: Payment): string {
    const alloc = this.myAllocations.find(a => a._id === payment.allocationId);
    const bill = alloc ? this.getBillForAllocation(alloc) : undefined;
    return bill ? this.getBillTypeName(bill.billTypeId) : 'Unknown';
  }

  getBillTypeName(billTypeId: string): string {
    return this.billTypes.find(t => t._id === billTypeId)?.name ?? 'Unknown';
  }

  get sortedPayments(): Payment[] {
    return [...this.payments].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
  }

  getBillForAllocation(alloc: Allocation): Bill | undefined {
    return this.bills.find(b => b._id === alloc.billId);
  }

  get unpaidAllocations(): Allocation[] {
    return this.myAllocations.filter(a => a.status !== 'paid');
  }

  get totalOwed(): number {
    return this.myAllocations.reduce((s, a) => s + a.amountOwed, 0);
  }

  get totalPaid(): number {
    return this.myAllocations.reduce((s, a) => s + a.amountPaid, 0);
  }

  get totalOutstanding(): number {
    return this.myAllocations.reduce((s, a) => s + (a.amountOwed - a.amountPaid), 0);
  }

  get billsToPay(): number {
    return this.unpaidAllocations.length;
  }

  // ── Payment Modal ──
  openPaymentModal(alloc: Allocation) {
    const bill = this.getBillForAllocation(alloc);
    this.paymentAllocationId = alloc._id!;
    this.paymentBillTypeId = bill?.billTypeId ?? '';
    this.paymentAmount = 0;
    this.paymentError = '';
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  submitPayment() {
    const alloc = this.myAllocations.find(a => a._id === this.paymentAllocationId);
    if (!alloc) return;

    const outstanding = alloc.amountOwed - alloc.amountPaid;
    if (this.paymentAmount <= 0) {
      this.paymentError = 'Amount must be greater than zero.';
      return;
    }
    if (this.paymentAmount > outstanding) {
      this.paymentError = `Cannot exceed outstanding amount of €${outstanding.toFixed(2)}.`;
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
