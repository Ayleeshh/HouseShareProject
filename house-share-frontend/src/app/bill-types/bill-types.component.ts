import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillTypeService } from '../services/bill-type.service';
import { HouseholdService } from '../services/household.service';
import { MemberService } from '../services/member.service';
import { BillType } from '../models/bill-type';
import { Household } from '../models/household';
import { Member } from '../models/member';

@Component({
  selector: 'app-bill-types', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [FormsModule, CommonModule],
  templateUrl: './bill-types.component.html',
  styleUrl: './bill-types.component.css'
})
export class BillTypesComponent implements OnInit {
  billTypes: BillType[] = [];
  households: Household[] = [];
  currentUser: Member | null = null;

  // Controls whether the create/edit modals are visible
  showCreateModal = false;
  showEditModal = false;

  // Holds the bill type being edited
  selectedBillType: BillType | null = null;

  // Holds the form data for creating a new bill type
  newBillType = { name: '', householdId: '' };

  // Injects the services needed by this component
  constructor(
    private billTypeService: BillTypeService,
    private householdService: HouseholdService,
    private memberService: MemberService
  ) {}

  // Runs when the component loads — fetches households and current user
  ngOnInit() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
    // Subscribes to the current user — when it changes, reload bill types
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
      this.loadBillTypes();
    });
  }

  // Fetches all bill types from the backend and stores them
  loadBillTypes() {
    if (!this.currentUser?.householdId) return;
    this.billTypeService.getBillTypesByHousehold(this.currentUser.householdId)
      .subscribe(res => this.billTypes = res);
  }

  // Looks up a household name by ID, returns 'Unknown' if not found
  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  // Opens the create modal and pre-fills the householdId from the current user
  openCreateModal() {
    this.newBillType = { name: '', householdId: this.currentUser?.householdId ?? '' };
    this.showCreateModal = true;
  }

  closeCreateModal() { this.showCreateModal = false; }

  // Sends the new bill type to the backend, then closes modal and refreshes the list
  createBillType() {
    if (!this.newBillType.name) return;
    this.billTypeService.createBillType({
      ...this.newBillType,
      householdId: this.currentUser?.householdId ?? ''
    }).subscribe(() => {
      this.showCreateModal = false;
      this.loadBillTypes();
    });
  }

  // Opens the edit modal with a copy of the selected bill type
  openEditModal(bt: BillType) {
    this.selectedBillType = { ...bt };
    this.showEditModal = true;
  }

  closeEditModal() { this.showEditModal = false; this.selectedBillType = null; }

  // Sends the updated bill type to the backend, then closes modal and refreshes the list
  updateBillType() {
    if (!this.selectedBillType?._id) return;
    this.billTypeService.updateBillType(this.selectedBillType._id, this.selectedBillType).subscribe(() => {
      this.showEditModal = false;
      this.loadBillTypes();
    });
  }

  // Asks for confirmation then deletes the bill type and refreshes the list
  deleteBillType(id: string) {
    if (!confirm('Delete this bill type?')) return;
    this.billTypeService.deleteBillType(id).subscribe(() => this.loadBillTypes());
  }
}
