import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberService } from '../services/member.service';
import { HouseholdService } from '../services/household.service';
import { AllocationService } from '../services/allocation.service';
import { Member } from '../models/member';
import { Household } from '../models/household';
import { Allocation } from '../models/allocation';
// forkJoin runs multiple HTTP calls at the same time and waits for all to finish
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-members', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [FormsModule, CommonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  // Data fetched from the backend
  members: Member[] = [];
  households: Household[] = [];
  allAllocations: Allocation[] = [];
  currentUser: Member | null = null;

  // Controls whether the create/edit modals are visible
  showCreateModal = false;
  showEditModal = false;

  // Holds the member currently being edited
  selectedMember: Member | null = null;

  // Holds the form data for creating a new member
  newMember = { name: '', email: '', householdId: '', isActive: true, isAdmin: false };

  // Injects all services needed by this component
  constructor(
    private memberService: MemberService,
    private householdService: HouseholdService,
    private allocationService: AllocationService,
  ) {}

  // Runs when the component loads — fetches households and watches for current user
  ngOnInit() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
      if (user) this.loadAll(user);
    });
  }

  // Fetches all members in the household, then loads all their allocations in parallel
  loadAll(user: Member) {
    this.memberService.getMembersByHousehold(user.householdId).subscribe(members => {
      this.members = members;
      if (members.length > 0) {
        // Fetches allocations for every member at the same time
        forkJoin(members.map(m => this.allocationService.getAllocationsByMember(m._id!)))
          .subscribe((results: Allocation[][]) => {
            this.allAllocations = results.flat(); // merges array of arrays into one
          });
      }
    });
  }

  // Looks up a household name by ID
  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  // Adds up all amountPaid across a member's allocations
  getTotalPaid(memberId: string): number {
    return this.allAllocations
      .filter(a => a.memberId === memberId)
      .reduce((s, a) => s + a.amountPaid, 0);
  }

  // Adds up all remaining outstanding amounts across a member's allocations
  getTotalOutstanding(memberId: string): number {
    return this.allAllocations
      .filter(a => a.memberId === memberId)
      .reduce((s, a) => s + (a.amountOwed - a.amountPaid), 0);
  }

  // Returns the overall payment status for a member across all their allocations
  getMemberStatus(memberId: string): string {
    const allocs = this.allAllocations.filter(a => a.memberId === memberId);
    if (!allocs.length) return 'unpaid';
    if (allocs.every(a => a.status === 'paid')) return 'paid'; // all bills paid
    if (allocs.some(a => a.amountPaid > 0)) return 'part-paid';  // at least one payment made
    return 'unpaid';
  }

  // Opens create modal and pre-fills householdId from current user
  openCreateModal() {
    this.newMember = { name: '', email: '', householdId: this.currentUser?.householdId ?? '', isActive: true, isAdmin: false };
    this.showCreateModal = true;
  }

  closeCreateModal() { this.showCreateModal = false; }

  // Sends the new member to the backend, then refreshes the list
  // loadMembers() also refreshes the member dropdown in the navbar/selector
  createMember() {
    if (!this.newMember.name || !this.newMember.email) return;
    this.memberService.createMember(this.newMember).subscribe(() => {
      this.showCreateModal = false;
      this.loadAll(this.currentUser!);
      this.memberService.loadMembers(); // refreshes the global member list used elsewhere in the app
    });
  }

  // Opens edit modal with a copy of the selected member so the original isn't mutated
  openEditModal(member: Member) {
    this.selectedMember = { ...member };
    this.showEditModal = true;
  }

  closeEditModal() { this.showEditModal = false; this.selectedMember = null; }

  // Sends the updated member to the backend then refreshes the list
  updateMember() {
    if (!this.selectedMember?._id) return;
    this.memberService.updateMember(this.selectedMember._id, this.selectedMember).subscribe(() => {
      this.showEditModal = false;
      this.loadAll(this.currentUser!);
    });
  }

  // Asks for confirmation then deletes the member and refreshes the list
  deleteMember(id: string) {
    if (!confirm('Delete this member?')) return;
    this.memberService.deleteMember(id).subscribe(() => this.loadAll(this.currentUser!));
  }
}
