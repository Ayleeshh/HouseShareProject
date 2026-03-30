import { Component, Input } from '@angular/core';
import { BillTypeService } from '../services/bill-type.service';
import { BillType } from '../models/bill-type';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Household} from "../models/household";
import {HouseholdService} from "../services/household.service";

@Component({
  selector: 'app-bill-types',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './bill-types.component.html',
  styleUrl: './bill-types.component.css'
})
export class BillTypesComponent {
  billTypes: BillType[] = [];
  households: Household[] = [];
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

  loadBillTypes() {
    this.billTypeService.getBillTypes().subscribe((res) => {
      this.billTypes = res;
    });
  }

  loadHouseholds() {  // add this method
    this.householdService.getHouseholds().subscribe((res) => {
      this.households = res;
    });
  }

  createBillType() {
    // console.log('householdId is:', this.householdId);
    if (!this.newBillType || !this.newBillType.householdId) return;
    this.billTypeService.createBillType(this.newBillType).subscribe(()=>{
      this.loadBillTypes();
      this.resetForm();
    });
  }

  resetForm() {
    this.newBillType = {
      name: '',
      householdId: ''
    };
  }
}
