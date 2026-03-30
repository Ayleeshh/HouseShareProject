import { Component, OnInit } from '@angular/core';
import { BillService } from '../services/bill.service';
import { BillTypeService } from '../services/bill-type.service';
import { HouseholdService } from '../services/household.service';
import { Bill } from '../models/bill';
import { BillType } from '../models/bill-type';
import { Household } from '../models/household';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  billTypes: BillType[] = [];
  households: Household[] = [];

  newBill = {
    description: '',
    totalAmount: 0,
    householdId: '',
    billTypeId: '',
    startDate: '',
    endDate: '',
    isClosed: false
  };

  constructor(
    private billService: BillService,
    private billTypeService: BillTypeService,
    private householdService: HouseholdService
  ) {}

  ngOnInit() {
    this.loadHouseholds();
    this.loadBillTypes();
  }

  loadBills() {
    if (!this.newBill.householdId) return;
    this.billService.getBillsByHousehold(this.newBill.householdId).subscribe({
      next: (data) => this.bills = data,
      error: (err) => console.error('Error loading bills', err)
    });
  }

  loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe({
      next: (data) => this.billTypes = data,
      error: (err) => console.error('Error loading bill types', err)
    });
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe({
      next: (data) => this.households = data,
      error: (err) => console.error('Error loading households', err)
    });
  }

  onHouseholdChange() {
    this.bills = [];
    this.loadBills();
  }

  addBill() {
    if (!this.newBill.description || !this.newBill.billTypeId || !this.newBill.householdId || !this.newBill.startDate || !this.newBill.endDate) {
      alert('Please fill all required fields!');
      return;
    }

    const payload: Bill = {
      householdId: this.newBill.householdId,
      billTypeId:  this.newBill.billTypeId,
      description: this.newBill.description,
      totalAmount: Math.round(this.newBill.totalAmount),
      startDate:   new Date(this.newBill.startDate).toISOString(),
      endDate:     new Date(this.newBill.endDate).toISOString(),
      isClosed:    this.newBill.isClosed
    };

    this.billService.createBill(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadBills();
      },
      error: (err) => {
        console.error('Server error:', err.error.message);
        alert('Error: ' + err.error.message);
      }
    });
  }

  resetForm() {
    const currentHouseholdId = this.newBill.householdId;  // preserve selected household
    this.newBill = {
      description: '',
      totalAmount: 0,
      householdId: currentHouseholdId,
      billTypeId: '',
      startDate: '',
      endDate: '',
      isClosed: false
    };
  }
}
