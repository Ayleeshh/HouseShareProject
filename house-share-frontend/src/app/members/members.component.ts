import {Component, OnInit} from '@angular/core';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import { HouseholdService } from '../services/household.service';
import { Household } from '../models/household';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})

export class MembersComponent implements OnInit{
  members: Member[] = [];
  households: Household[] = [];
  newMember = {
    name: '',
    householdId: '',
    email: '',
    isActive: false,
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

  loadMembers() {
    this.memberService.getMembers().subscribe((res) => {
      this.members = res;
    });
  }

  loadHouseholds() {  // add this method
    this.householdService.getHouseholds().subscribe((res) => {
      this.households = res;
    });
  }


  createMember() {
    if (!this.newMember.name || !this.newMember.email || !this.newMember.householdId) return;
    this.memberService.createMember(this.newMember).subscribe(() => {
      this.loadMembers();
      this.resetForm(); // good practice to clear the form after submit
    });
  }

  resetForm() {
    this.newMember = {
      name: '',
      email: '',
      householdId: '',
      isActive: false,
      isAdmin: false
    };
  }
}
