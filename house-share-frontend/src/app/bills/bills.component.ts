import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { BillService } from '../services/bill.service';
import { BillTypeService } from '../services/bill-type.service';
import { HouseholdService } from '../services/household.service';
import { AllocationService } from '../services/allocation.service';
import { Bill } from '../models/bill';
import { BillType } from '../models/bill-type';
import { Household } from '../models/household';
import { Allocation } from '../models/allocation';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  activeTab: 'view' | 'create' | 'detail' = 'view';

  bills: Bill[] = [];
  billTypes: BillType[] = [];
  households: Household[] = [];
  allocations: Allocation[] = [];
  selectedBill: Bill | null = null;
  filterHouseholdId = '';

  newBill = {
    description: '',
    totalAmount: 0,
    householdId: '',
    billTypeId: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    private billService: BillService,
    private billTypeService: BillTypeService,
    private householdService: HouseholdService,
    private allocationService: AllocationService,
  ) {}

  ngOnInit() {
    this.loadHouseholds();
    this.loadBillTypes();
  }

  setTab(tab: 'view' | 'create' | 'detail') {
    this.activeTab = tab;
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
  }

  loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe(res => this.billTypes = res);
  }

  loadBills() {
    if (!this.filterHouseholdId) return;
    this.billService.getBillsByHousehold(this.filterHouseholdId).subscribe(res => this.bills = res);
  }

  getBillTypeName(id: string): string {
    return this.billTypes.find(t => t._id === id)?.name ?? 'Unknown';
  }

  getHouseholdName(id: string): string {
    return this.households.find(h => h._id === id)?.name ?? 'Unknown';
  }

  createBill() {
    if (!this.newBill.description || !this.newBill.householdId || !this.newBill.billTypeId || !this.newBill.startDate || !this.newBill.endDate) {
      alert('Please fill all fields');
      return;
    }
    const payload: Bill = {
      ...this.newBill,
      totalAmount: parseFloat(this.newBill.totalAmount.toFixed(2)),
      startDate: new Date(this.newBill.startDate).toISOString(),
      endDate: new Date(this.newBill.endDate).toISOString(),
    };
    this.billService.createBill(payload).subscribe({
      next: () => {
        this.newBill = { description: '', totalAmount: 0, householdId: '', billTypeId: '', startDate: '', endDate: '' };
        this.loadBills();
        this.setTab('view');
      },
      error: (err) => alert('Error: ' + err.error.message)
    });
  }

  viewDetail(bill: Bill) {
    this.selectedBill = bill;
    if (bill._id) {
      this.allocationService.getAllocationsByBill(bill._id).subscribe(res => {
        this.allocations = res;
      });
    }
    this.setTab('detail');
  }

  deleteBill(id: string) {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    this.billService.deleteBill(id).subscribe(() => {
      this.loadBills();
    });
  }
}
