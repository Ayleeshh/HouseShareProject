import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MemberService } from '../services/member.service';
import { BillService } from '../services/bill.service';
import { AllocationService } from '../services/allocation.service';
import { HouseholdService } from '../services/household.service';
import { Member } from '../models/member';
import { Bill } from '../models/bill';
import { Allocation } from '../models/allocation';
import { Household } from '../models/household';

// forkJoin runs multiple HTTP calls at the same time and waits for all to finish
// of creates an Observable from a plain value (used as a fallback)
// switchMap chains a second set of HTTP calls after the first ones finish
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Data fetched from the backend
  currentUser: Member | null = null;
  household: Household | null = null;
  members: Member[] = [];
  recentBills: Bill[] = [];
  allAllocations: Allocation[] = [];

  // Calculated totals displayed on the dashboard
  totalOutstanding = 0;
  totalCollected = 0;
  myOutstanding = 0;

  loading = true;

  // Injects all services needed by this component
  constructor(
    private memberService: MemberService,
    private billService: BillService,
    private allocationService: AllocationService,
    private householdService: HouseholdService
  ) {}

  // Runs when the component loads — waits for current user then loads dashboard
  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      if (user) {
        this.currentUser = user;
        this.loadDashboard(user);
      }
    });
  }

  loadDashboard(user: Member) {
    this.loading = true;

    // Step 1 — fetch household, members and bills all at the same time
    forkJoin({
      household: this.householdService.getHousehold(user.householdId),
      members: this.memberService.getMembersByHousehold(user.householdId),
      bills: this.billService.getBillsByHousehold(user.householdId)
    }).pipe(
      // switchMap waits for step 1 to finish, then kicks off step 2
      switchMap(({ household, members, bills }) => {
        this.household = household;
        this.members = members;
        this.recentBills = bills.slice(0, 5); // show 5 most recent

        // Step 2 — fetch allocations for every bill at the same time
        const allocationRequests = bills.map(bill =>
          this.allocationService.getAllocationsByBill(bill._id!)
        );

        // If there are no bills, return an empty array instead of forkJoin (avoids error)
        return allocationRequests.length > 0 ? forkJoin(allocationRequests) : of([]);      })
    ).subscribe({
      // Runs when all data has loaded successfully
      next: (allocationArrays: Allocation[][]) => {
        this.allAllocations = allocationArrays.flat(); // merges array of arrays into one
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error', err);
        this.loading = false;
      }
    });
  }

  // Loops through all allocations and calculates the three dashboard totals
  calculateTotals() {
    this.totalOutstanding = 0;
    this.totalCollected = 0;
    this.myOutstanding = 0;

    for (const alloc of this.allAllocations) {
      const outstanding = alloc.amountOwed - alloc.amountPaid;
      this.totalCollected += alloc.amountPaid;
      if (outstanding > 0) this.totalOutstanding += outstanding;

      // If this allocation belongs to the current user, add to their personal outstanding
      if (alloc.memberId === this.currentUser?._id && outstanding > 0) {
        this.myOutstanding += outstanding;
      }
    }
  }

  // Returns overall status of a bill based on its allocations
  getBillStatus(bill: Bill): string {
    const billAllocs = this.allAllocations.filter(a => a.billId === bill._id);
    if (billAllocs.length === 0) return 'unpaid';
    if (billAllocs.every(a => a.status === 'paid')) return 'paid'; // all members paid
    if (billAllocs.some(a => a.amountPaid > 0)) return 'part-paid'; // at least one paid something
    return 'unpaid';
  }

  // Returns the first letter of a name, used to show member initials in the UI
  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
