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

// forkJoin runs multiple HTTP calls at the same time and waits for all to finish
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bills', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [FormsModule, CommonModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  // Lists of data fetched from the backend
  bills: Bill[] = [];
  billTypes: BillType[] = [];
  households: Household[] = [];
  members: Member[] = [];
  allAllocations: Allocation[] = [];
  currentUser: Member | null = null;

  // Controls the bill detail modal
  showDetail = false;
  selectedBill: Bill | null = null;
  selectedBillAllocations: Allocation[] = [];

  // Controls the create bill modal and holds its form data
  showCreateModal = false;
  newBill = {
    description: '',
    totalAmount: 0,
    householdId: '',
    billTypeId: '',
    startDate: '',
    endDate: '',
  };

  // Controls the edit bill modal and holds the bill being edited
  showEditModal = false;
  editBill: Bill | null = null;

  // Controls the payment modal and holds its form data
  showPaymentModal = false;
  paymentBillTypeId = '';
  paymentAmount = 0;
  paymentAllocationId = '';
  paymentError = '';

  // Injects all services needed by this component
  constructor(
    private billService: BillService,
    private billTypeService: BillTypeService,
    private householdService: HouseholdService,
    private allocationService: AllocationService,
    private paymentService: PaymentService,
    private memberService: MemberService,
  ) {}

  // Runs when the component loads — waits for current user then loads all data
  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      if (user) {
        this.currentUser = user;
        this.loadAll(user);
      }
    });
  }

  // Fetches all data needed for the page in parallel using forkJoin
  loadAll(user: Member) {
    forkJoin({
      billTypes: this.billTypeService.getBillTypesByHousehold(user.householdId), // ← filtered
      households: this.householdService.getHouseholds(),
      members: this.memberService.getMembersByHousehold(user.householdId),
      bills: this.billService.getBillsByHousehold(user.householdId),
    }).subscribe(({ billTypes, households, members, bills }) => {
      this.billTypes = billTypes;
      this.households = households;
      this.members = members;
      this.bills = bills;

      // Once bills are loaded, fetch allocations for every bill at the same time
      if (bills.length > 0) {
        forkJoin(bills.map(b => this.allocationService.getAllocationsByBill(b._id!)))
          .subscribe((results: Allocation[][]) => {
            // .flat() merges the array of arrays into one single array
            this.allAllocations = results.flat();
          });
      } else {
        this.allAllocations = [];
      }
    });
  }

  // Looks up a bill type name by ID
  getBillTypeName(id: string): string {
    return this.billTypes.find(t => t._id === id)?.name ?? 'Unknown';
  }

  // Looks up a member name by ID
  getMemberName(id: string): string {
    return this.members.find(m => m._id === id)?.name ?? 'Unknown';
  }

  // Looks up a household name by ID
  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  // Returns all allocations belonging to a specific bill
  getBillAllocations(billId: string): Allocation[] {
    return this.allAllocations.filter(a => a.billId === billId);
  }

  // Adds up all amountPaid across a bill's allocations
  getAmountCollected(billId: string): number {
    return this.getBillAllocations(billId).reduce((sum, a) => sum + a.amountPaid, 0);
  }

  // Adds up all remaining outstanding amounts across a bill's allocations
  getAmountOutstanding(billId: string): number {
    return this.getBillAllocations(billId).reduce((sum, a) => sum + (a.amountOwed - a.amountPaid), 0);
  }

  // Returns overall bill status based on its allocations
  getBillStatus(billId: string): string {
    const allocs = this.getBillAllocations(billId);
    if (!allocs.length) return 'unpaid';
    if (allocs.every(a => a.status === 'paid')) return 'paid'; // all members paid
    if (allocs.some(a => a.amountPaid > 0)) return 'part-paid'; // at least one member paid something
    return 'unpaid';
  }

  // Returns bills where the current user's allocation is not yet fully paid
  get myUnpaidBills(): Bill[] {
    if (!this.currentUser) return [];
    return this.bills.filter(b => {
      const alloc = this.allAllocations.find(
        a => a.billId === b._id && a.memberId === this.currentUser!._id
      );
      return alloc && alloc.status !== 'paid';
    });
  }

  // Finds the current user's allocation for a specific bill
  getMyAllocation(billId: string): Allocation | undefined {
    return this.allAllocations.find(
      a => a.billId === billId && a.memberId === this.currentUser?._id
    );
  }

// Opens the detail modal for a selected bill
  viewDetail(bill: Bill) {
    this.selectedBill = bill;
    this.selectedBillAllocations = this.getBillAllocations(bill._id!);
    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedBill = null;
  }

  // Opens create modal and pre-fills householdId from current user
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

  // Validates form, builds the bill payload and sends it to the backend
  createBill() {
    if (!this.newBill.billTypeId || !this.newBill.totalAmount || !this.newBill.startDate || !this.newBill.endDate) {
      alert('Please fill all fields');
      return;
    }
    const payload: Bill = {
      ...this.newBill,
      householdId: this.currentUser!.householdId,
      // Ensures amount is stored to 2 decimal places
      totalAmount: parseFloat(this.newBill.totalAmount.toFixed(2)),
      // Converts date strings to ISO format for MongoDB
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

  // Opens edit modal with a copy of the bill so the original isn't mutated
  openEditModal(bill: Bill) {
    this.editBill = { ...bill };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editBill = null;
  }

  // Sends the updated bill to the backend then refreshes the page data
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

  // Asks for confirmation then deletes the bill and refreshes the list
  deleteBill(id: string) {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    this.billService.deleteBill(id).subscribe(() => {
      this.loadAll(this.currentUser!);
    });
  }

  // Opens the payment modal pre-filled with the current user's allocation for this bill
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

  // Validates the payment amount then submits it to the backend
  submitPayment() {
    const alloc = this.allAllocations.find(a => a._id === this.paymentAllocationId);
    if (!alloc) return;

    // Work in whole cents to avoid floating point issues entirely
    const owedCents = Math.round(alloc.amountOwed * 100);
    const paidCents = Math.round(alloc.amountPaid * 100);
    const paymentCents = Math.round(this.paymentAmount * 100);
    const outstandingCents = owedCents - paidCents;

    console.log('paymentAmount type:', typeof this.paymentAmount, 'value:', this.paymentAmount);

    console.log({
      amountOwed: alloc.amountOwed,
      amountPaid: alloc.amountPaid,
      paymentAmount: this.paymentAmount,
      owedCents,
      paidCents,
      paymentCents,
      outstandingCents,
    });
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
