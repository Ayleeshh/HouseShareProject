import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { BillTypeService } from '../services/bill-type.service';
import { HouseholdService } from '../services/household.service';
import { BillType } from '../models/bill-type';
import { Household } from '../models/household';

@Component({
  selector: 'app-bill-types',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './bill-types.component.html',
  styleUrl: './bill-types.component.css'
})
export class BillTypesComponent implements OnInit {
  activeTab: 'view' | 'create' | 'edit' = 'view';

  billTypes: BillType[] = [];
  households: Household[] = [];
  selectedBillType: BillType | null = null;

  newBillType = {
    name: '',
    householdId: ''
  };

  constructor(
    private billTypeService: BillTypeService,
    private householdService: HouseholdService
  ) {}

  ngOnInit() {
    this.loadBillTypes();
    this.loadHouseholds();
  }

  setTab(tab: 'view' | 'create' | 'edit') {
    this.activeTab = tab;
  }

  loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe(res => this.billTypes = res);
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  createBillType() {
    if (!this.newBillType.name || !this.newBillType.householdId) return;
    this.billTypeService.createBillType(this.newBillType).subscribe(() => {
      this.newBillType = { name: '', householdId: '' };
      this.loadBillTypes();
      this.setTab('view');
    });
  }

  selectBillType(billType: BillType) {
    this.selectedBillType = { ...billType };
    this.setTab('edit');
  }

  updateBillType() {
    if (!this.selectedBillType?._id) return;
    this.billTypeService.updateBillType(this.selectedBillType._id, this.selectedBillType).subscribe(() => {
      this.selectedBillType = null;
      this.loadBillTypes();
      this.setTab('view');
    });
  }

  deleteBillType(id: string) {
    if (!confirm('Are you sure you want to delete this bill type?')) return;
    this.billTypeService.deleteBillType(id).subscribe(() => {
      this.loadBillTypes();
    });
  }
}
