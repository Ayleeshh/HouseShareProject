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
  selector: 'app-bill-types',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bill-types.component.html',
  styleUrl: './bill-types.component.css'
})
export class BillTypesComponent implements OnInit {
  billTypes: BillType[] = [];
  households: Household[] = [];
  currentUser: Member | null = null;

  showCreateModal = false;
  showEditModal = false;
  selectedBillType: BillType | null = null;

  newBillType = { name: '', householdId: '' };

  constructor(
    private billTypeService: BillTypeService,
    private householdService: HouseholdService,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
      this.loadBillTypes();
    });
  }

  loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe(res => this.billTypes = res);
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  openCreateModal() {
    this.newBillType = { name: '', householdId: this.currentUser?.householdId ?? '' };
    this.showCreateModal = true;
  }

  closeCreateModal() { this.showCreateModal = false; }

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

  openEditModal(bt: BillType) {
    this.selectedBillType = { ...bt };
    this.showEditModal = true;
  }

  closeEditModal() { this.showEditModal = false; this.selectedBillType = null; }

  updateBillType() {
    if (!this.selectedBillType?._id) return;
    this.billTypeService.updateBillType(this.selectedBillType._id, this.selectedBillType).subscribe(() => {
      this.showEditModal = false;
      this.loadBillTypes();
    });
  }

  deleteBillType(id: string) {
    if (!confirm('Delete this bill type?')) return;
    this.billTypeService.deleteBillType(id).subscribe(() => this.loadBillTypes());
  }
}
