import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {forkJoin, of, switchMap} from 'rxjs';
import { MemberService } from '../services/member.service';
import { BillService } from '../services/bill.service';
import { AllocationService } from '../services/allocation.service';
import { HouseholdService } from '../services/household.service';
import { Member } from '../models/member';
import { Bill } from '../models/bill';
import { Allocation } from '../models/allocation';
import { Household } from '../models/household';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: Member | null = null;
  household: Household | null = null;
  members: Member[] = [];
  recentBills: Bill[] = [];
  allAllocations: Allocation[] = [];

  totalOutstanding = 0;
  totalCollected = 0;
  myOutstanding = 0;

  loading = true;

  constructor(
    private memberService: MemberService,
    private billService: BillService,
    private allocationService: AllocationService,
    private householdService: HouseholdService
  ) {}

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

    // 1. Load household + members + bills in parallel
    forkJoin({
      household: this.householdService.getHousehold(user.householdId),
      members: this.memberService.getMembersByHousehold(user.householdId),
      bills: this.billService.getBillsByHousehold(user.householdId)
    }).pipe(
      switchMap(({ household, members, bills }) => {
        this.household = household;
        this.members = members;
        this.recentBills = bills.slice(0, 5); // show 5 most recent

        // 2. Load allocations for each bill in parallel
        const allocationRequests = bills.map(bill =>
          this.allocationService.getAllocationsByBill(bill._id!)
        );

        return allocationRequests.length > 0 ? forkJoin(allocationRequests) : of([]);      })
    ).subscribe({
      next: (allocationArrays: Allocation[][]) => {
        this.allAllocations = allocationArrays.flat();
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error', err);
        this.loading = false;
      }
    });
  }

  calculateTotals() {
    this.totalOutstanding = 0;
    this.totalCollected = 0;
    this.myOutstanding = 0;

    for (const alloc of this.allAllocations) {
      const outstanding = alloc.amountOwed - alloc.amountPaid;
      this.totalCollected += alloc.amountPaid;
      if (outstanding > 0) this.totalOutstanding += outstanding;

      if (alloc.memberId === this.currentUser?._id && outstanding > 0) {
        this.myOutstanding += outstanding;
      }
    }
  }

  getBillStatus(bill: Bill): string {
    const billAllocs = this.allAllocations.filter(a => a.billId === bill._id);
    if (billAllocs.length === 0) return 'unpaid';
    if (billAllocs.every(a => a.status === 'paid')) return 'paid';
    if (billAllocs.some(a => a.amountPaid > 0)) return 'part-paid';
    return 'unpaid';
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
