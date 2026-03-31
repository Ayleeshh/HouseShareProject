import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MemberService } from '../services/member.service';
import { HouseholdService } from '../services/household.service';
import { Member } from '../models/member';
import { Household } from '../models/household';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  activeTab: 'view' | 'create' | 'edit' = 'view';

  members: Member[] = [];
  households: Household[] = [];
  selectedMember: Member | null = null;

  newMember = {
    name: '',
    email: '',
    householdId: '',
    isActive: true,
    isAdmin: false
  };

  constructor(
    private memberService: MemberService,
    private householdService: HouseholdService
  ) {}

  ngOnInit() {
    this.loadMembers();
    this.loadHouseholds();
  }

  setTab(tab: 'view' | 'create' | 'edit') {
    this.activeTab = tab;
  }

  loadMembers() {
    this.memberService.getMembers().subscribe(res => this.members = res);
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  createMember() {
    if (!this.newMember.name || !this.newMember.email || !this.newMember.householdId) return;
    this.memberService.createMember(this.newMember).subscribe(() => {
      this.newMember = { name: '', email: '', householdId: '', isActive: true, isAdmin: false };
      this.loadMembers();
      this.setTab('view');
    });
  }

  selectMember(member: Member) {
    this.selectedMember = { ...member };
    this.setTab('edit');
  }

  updateMember() {
    if (!this.selectedMember?._id) return;
    this.memberService.updateMember(this.selectedMember._id, this.selectedMember).subscribe(() => {
      this.selectedMember = null;
      this.loadMembers();
      this.setTab('view');
    });
  }

  deleteMember(id: string) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    this.memberService.deleteMember(id).subscribe(() => {
      this.loadMembers();
    });
  }
}
