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
  selector: 'app-payments', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  // Data fetched from the backend
  payments: Payment[] = [];
  members: Member[] = [];
  households: Household[] = [];
  bills: Bill[] = [];
  allocations: Allocation[] = [];

  // Tracks which household and bill are selected in the dropdowns
  selectedHouseholdId = '';
  selectedBillId = '';

  // Holds the form data for creating a new payment
  // paidAt defaults to today's date
  newPayment = {
    allocationId: '',
    memberId: '',
    amount: 0,
    paidAt: new Date().toISOString().split('T')[0]
  };

  // Injects all services needed by this component
  constructor(
    private paymentService: PaymentService,
    private memberService: MemberService,
    private householdService: HouseholdService,
    private billService: BillService,
    private allocationService: AllocationService,
  ) {}

  // Runs when the component loads — fetches all households for the dropdown
  ngOnInit() {
    this.householdService.getHouseholds().subscribe(d => this.households = d);
  }

  // Runs when the user picks a household — loads that household's bills and members
  onHouseholdChange() {
    // Reset dependent dropdowns when household changes
    this.bills = [];
    this.allocations = [];
    this.selectedBillId = '';
    this.newPayment.allocationId = '';

    this.billService.getBillsByHousehold(this.selectedHouseholdId)
      .subscribe(d => this.bills = d);

    this.memberService.getMembersByHousehold(this.selectedHouseholdId)
      .subscribe(d => this.members = d);
  }

  // Runs when the user picks a bill — loads that bill's allocations
  onBillChange() {
    // Reset allocation dropdown when bill changes
    this.allocations = [];
    this.newPayment.allocationId = '';

    this.allocationService.getAllocationsByBill(this.selectedBillId)
      .subscribe(d => this.allocations = d);
  }

  // Runs when the user picks an allocation — auto-fills the memberId from that allocation
  onAllocationChange() {
    const allocation = this.allocations.find(
      a => a._id === this.newPayment.allocationId
    );
    if (allocation) {
      this.newPayment.memberId = allocation.memberId;
    }
  }

  // Looks up a member name by ID
  getMemberName(memberId: string): string {
    return this.members.find(m => m._id === memberId)?.name ?? 'Unknown';
  }

  // Calculates how much is still outstanding for an allocation
  getOutstanding(allocation: Allocation): number {
    return +(allocation.amountOwed - allocation.amountPaid).toFixed(2);
  }

  // Validates form data then submits the payment to the backend
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
        this.onBillChange(); // refreshes allocations so updated paid/outstanding amounts show immediately
      },
      error: (err) => {
        console.error(err);
        alert('Error: ' + err.error.message);
      }
    });
  }
}
