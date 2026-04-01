import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberService } from '../services/member.service';
import { HouseholdService } from '../services/household.service';
import { AllocationService } from '../services/allocation.service';
import { Member } from '../models/member';
import { Household } from '../models/household';
import { Allocation } from '../models/allocation';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  households: Household[] = [];
  allAllocations: Allocation[] = [];
  currentUser: Member | null = null;

  showCreateModal = false;
  showEditModal = false;
  selectedMember: Member | null = null;

  newMember = { name: '', email: '', householdId: '', isActive: true, isAdmin: false };

  constructor(
    private memberService: MemberService,
    private householdService: HouseholdService,
    private allocationService: AllocationService,
  ) {}

  ngOnInit() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
      if (user) this.loadAll(user);
    });
  }

  loadAll(user: Member) {
    this.memberService.getMembersByHousehold(user.householdId).subscribe(members => {
      this.members = members;
      if (members.length > 0) {
        forkJoin(members.map(m => this.allocationService.getAllocationsByMember(m._id!)))
          .subscribe((results: Allocation[][]) => {
            this.allAllocations = results.flat();
          });
      }
    });
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  getTotalPaid(memberId: string): number {
    return this.allAllocations
      .filter(a => a.memberId === memberId)
      .reduce((s, a) => s + a.amountPaid, 0);
  }

  getTotalOutstanding(memberId: string): number {
    return this.allAllocations
      .filter(a => a.memberId === memberId)
      .reduce((s, a) => s + (a.amountOwed - a.amountPaid), 0);
  }

  getMemberStatus(memberId: string): string {
    const allocs = this.allAllocations.filter(a => a.memberId === memberId);
    if (!allocs.length) return 'unpaid';
    if (allocs.every(a => a.status === 'paid')) return 'paid';
    if (allocs.some(a => a.amountPaid > 0)) return 'part-paid';
    return 'unpaid';
  }

  openCreateModal() {
    this.newMember = { name: '', email: '', householdId: this.currentUser?.householdId ?? '', isActive: true, isAdmin: false };
    this.showCreateModal = true;
  }

  closeCreateModal() { this.showCreateModal = false; }

  createMember() {
    if (!this.newMember.name || !this.newMember.email) return;
    this.memberService.createMember(this.newMember).subscribe(() => {
      this.showCreateModal = false;
      this.loadAll(this.currentUser!);
      this.memberService.loadMembers();
    });
  }

  openEditModal(member: Member) {
    this.selectedMember = { ...member };
    this.showEditModal = true;
  }

  closeEditModal() { this.showEditModal = false; this.selectedMember = null; }

  updateMember() {
    if (!this.selectedMember?._id) return;
    this.memberService.updateMember(this.selectedMember._id, this.selectedMember).subscribe(() => {
      this.showEditModal = false;
      this.loadAll(this.currentUser!);
    });
  }

  deleteMember(id: string) {
    if (!confirm('Delete this member?')) return;
    this.memberService.deleteMember(id).subscribe(() => this.loadAll(this.currentUser!));
  }
}
