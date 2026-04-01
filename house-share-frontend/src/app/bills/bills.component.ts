import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillService } from '../services/bill.service';
import { BillTypeService } from '../services/bill-type.service';
import { HouseholdService } from '../services/household.service';
import { AllocationService } from '../services/allocation.service';
import { PaymentService } from '../services/payment.service';
import { MemberService } from '../services/member.service';
import { Bill } from '../models/bill';
import { BillType } from '../models/bill-type';
import { Household } from '../models/household';
import { Allocation } from '../models/allocation';
import { Member } from '../models/member';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  // ── Data ──
  bills: Bill[] = [];
  billTypes: BillType[] = [];
  households: Household[] = [];
  members: Member[] = [];
  allAllocations: Allocation[] = [];
  currentUser: Member | null = null;

  // ── Detail Modal ──
  showDetail = false;
  selectedBill: Bill | null = null;
  selectedBillAllocations: Allocation[] = [];

  // ── Create Modal ──
  showCreateModal = false;
  newBill = {
    description: '',
    totalAmount: 0,
    householdId: '',
    billTypeId: '',
    startDate: '',
    endDate: '',
  };

  // ── Edit Modal ──
  showEditModal = false;
  editBill: Bill | null = null;

  // ── Payment Modal ──
  showPaymentModal = false;
  paymentBillTypeId = '';
  paymentAmount = 0;
  paymentAllocationId = '';
  paymentError = '';

  constructor(
    private billService: BillService,
    private billTypeService: BillTypeService,
    private householdService: HouseholdService,
    private allocationService: AllocationService,
    private paymentService: PaymentService,
    private memberService: MemberService,
  ) {}

  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      if (user) {
        this.currentUser = user;
        this.loadAll(user);
      }
    });
  }

  // ── Load All Data ──
  loadAll(user: Member) {
    forkJoin({
      billTypes: this.billTypeService.getBillTypes(),
      households: this.householdService.getHouseholds(),
      members: this.memberService.getMembersByHousehold(user.householdId),
      bills: this.billService.getBillsByHousehold(user.householdId),
    }).subscribe(({ billTypes, households, members, bills }) => {
      this.billTypes = billTypes;
      this.households = households;
      this.members = members;
      this.bills = bills;

      if (bills.length > 0) {
        forkJoin(bills.map(b => this.allocationService.getAllocationsByBill(b._id!)))
          .subscribe((results: Allocation[][]) => {
            this.allAllocations = results.flat();
          });
      } else {
        this.allAllocations = [];
      }
    });
  }

  // ── Helpers ──
  getBillTypeName(id: string): string {
    return this.billTypes.find(t => t._id === id)?.name ?? 'Unknown';
  }

  getMemberName(id: string): string {
    return this.members.find(m => m._id === id)?.name ?? 'Unknown';
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  getBillAllocations(billId: string): Allocation[] {
    return this.allAllocations.filter(a => a.billId === billId);
  }

  getAmountCollected(billId: string): number {
    return this.getBillAllocations(billId).reduce((sum, a) => sum + a.amountPaid, 0);
  }

  getAmountOutstanding(billId: string): number {
    return this.getBillAllocations(billId).reduce((sum, a) => sum + (a.amountOwed - a.amountPaid), 0);
  }

  getBillStatus(billId: string): string {
    const allocs = this.getBillAllocations(billId);
    if (!allocs.length) return 'unpaid';
    if (allocs.every(a => a.status === 'paid')) return 'paid';
    if (allocs.some(a => a.amountPaid > 0)) return 'part-paid';
    return 'unpaid';
  }

  get myUnpaidBills(): Bill[] {
    if (!this.currentUser) return [];
    return this.bills.filter(b => {
      const alloc = this.allAllocations.find(
        a => a.billId === b._id && a.memberId === this.currentUser!._id
      );
      return alloc && alloc.status !== 'paid';
    });
  }

  getMyAllocation(billId: string): Allocation | undefined {
    return this.allAllocations.find(
      a => a.billId === billId && a.memberId === this.currentUser?._id
    );
  }

  // ── Detail Modal ──
  viewDetail(bill: Bill) {
    this.selectedBill = bill;
    this.selectedBillAllocations = this.getBillAllocations(bill._id!);
    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedBill = null;
  }

  // ── Create Modal ──
  openCreateModal() {
    this.newBill = {
      description: '',
      totalAmount: 0,
      householdId: this.currentUser?.householdId ?? '',
      billTypeId: '',
      startDate: '',
      endDate: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createBill() {
    if (!this.newBill.billTypeId || !this.newBill.totalAmount || !this.newBill.startDate || !this.newBill.endDate) {
      alert('Please fill all fields');
      return;
    }
    const payload: Bill = {
      ...this.newBill,
      householdId: this.currentUser!.householdId,
      totalAmount: parseFloat(this.newBill.totalAmount.toFixed(2)),
      startDate: new Date(this.newBill.startDate).toISOString(),
      endDate: new Date(this.newBill.endDate).toISOString(),
    };
    this.billService.createBill(payload).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadAll(this.currentUser!);
      },
      error: (err) => alert('Error: ' + err.error?.message)
    });
  }

  // ── Edit Modal ──
  openEditModal(bill: Bill) {
    this.editBill = { ...bill };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editBill = null;
  }

  updateBill() {
    if (!this.editBill?._id) return;
    this.billService.updateBill(this.editBill._id, this.editBill).subscribe({
      next: () => {
        this.showEditModal = false;
        this.editBill = null;
        this.loadAll(this.currentUser!);
      },
      error: (err) => alert('Error: ' + err.error?.message)
    });
  }

  // ── Delete ──
  deleteBill(id: string) {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    this.billService.deleteBill(id).subscribe(() => {
      this.loadAll(this.currentUser!);
    });
  }

  // ── Payment Modal ──
  openPaymentModal(bill: Bill) {
    const alloc = this.getMyAllocation(bill._id!);
    if (!alloc) return;
    this.paymentAllocationId = alloc._id!;
    this.paymentBillTypeId = bill.billTypeId;
    this.paymentAmount = 0;
    this.paymentError = '';
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  submitPayment() {
    const alloc = this.allAllocations.find(a => a._id === this.paymentAllocationId);
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
