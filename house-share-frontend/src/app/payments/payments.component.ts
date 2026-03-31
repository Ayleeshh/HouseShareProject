import { Component, OnInit } from '@angular/core';
import { Payment } from "../models/payment";
import { PaymentService } from "../services/payment.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Member } from "../models/member";
import { MemberService } from "../services/member.service";
import { HouseholdService } from "../services/household.service";
import { BillService } from "../services/bill.service";
import { AllocationService } from "../services/allocation.service";
import { Household } from "../models/household";
import { Bill } from "../models/bill";
import { Allocation } from "../models/allocation";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  members: Member[] = [];
  households: Household[] = [];
  bills: Bill[] = [];
  allocations: Allocation[] = [];

  selectedHouseholdId = '';
  selectedBillId = '';

  newPayment = {
    allocationId: '',
    memberId: '',
    amount: 0,
    paidAt: new Date().toISOString().split('T')[0]
  };

  constructor(
    private paymentService: PaymentService,
    private memberService: MemberService,
    private householdService: HouseholdService,
    private billService: BillService,
    private allocationService: AllocationService,
  ) {}

  ngOnInit() {
    this.householdService.getHouseholds().subscribe(d => this.households = d);
  }

  onHouseholdChange() {
    this.bills = [];
    this.allocations = [];
    this.selectedBillId = '';
    this.newPayment.allocationId = '';

    this.billService.getBillsByHousehold(this.selectedHouseholdId)
      .subscribe(d => this.bills = d);

    this.memberService.getMembersByHousehold(this.selectedHouseholdId)
      .subscribe(d => this.members = d);
  }

  onBillChange() {
    this.allocations = [];
    this.newPayment.allocationId = '';

    this.allocationService.getAllocationsByBill(this.selectedBillId)
      .subscribe(d => this.allocations = d);
  }

  onAllocationChange() {
    const allocation = this.allocations.find(
      a => a._id === this.newPayment.allocationId
    );
    if (allocation) {
      this.newPayment.memberId = allocation.memberId;
    }
  }

  getMemberName(memberId: string): string {
    return this.members.find(m => m._id === memberId)?.name ?? 'Unknown';
  }

  getOutstanding(allocation: Allocation): number {
    return +(allocation.amountOwed - allocation.amountPaid).toFixed(2);
  }

  addPayment() {
    if (!this.newPayment.allocationId || !this.newPayment.amount || !this.newPayment.paidAt) {
      alert('Please fill all fields');
      return;
    }
    if (this.newPayment.amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    this.paymentService.createPayment(this.newPayment).subscribe({
      next: () => {
        alert('Payment recorded!');
        this.newPayment.amount = 0;
        this.onBillChange(); // refresh allocations to show updated status
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + err.error.message);
      }
    });
  }
}
