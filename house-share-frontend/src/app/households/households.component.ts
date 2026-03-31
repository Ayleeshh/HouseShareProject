import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { HouseholdService } from '../services/household.service';
import { Household } from '../models/household';

@Component({
  selector: 'app-households',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './households.component.html',
  styleUrl: './households.component.css'
})
export class HouseholdsComponent implements OnInit {
  activeTab: 'create' | 'view' | 'edit' = 'view';

  households: Household[] = [];
  newHouseholdName = '';
  selectedHousehold: Household | null = null;

  constructor(private householdService: HouseholdService) {}

  ngOnInit() {
    this.loadHouseholds();
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
  }

  setTab(tab: 'create' | 'view' | 'edit') {
    this.activeTab = tab;
  }

  // CREATE
  createHousehold() {
    if (!this.newHouseholdName) return;
    this.householdService.createHousehold({ name: this.newHouseholdName }).subscribe(() => {
      this.newHouseholdName = '';
      this.loadHouseholds();
      this.setTab('view');  // switch to view after creating
    });
  }

  // SELECT FOR EDIT
  selectHousehold(household: Household) {
    this.selectedHousehold = { ...household };
    this.setTab('edit');  // switch to edit tab when Edit clicked
  }

  // UPDATE
  updateHousehold() {
    if (!this.selectedHousehold?._id) return;
    this.householdService
      .updateHousehold(this.selectedHousehold._id, { name: this.selectedHousehold.name })
      .subscribe(() => {
        this.selectedHousehold = null;
        this.loadHouseholds();
        this.setTab('view');  // back to view after saving
      });
  }

  deleteHousehold(id: string) {
    if (!confirm('Are you sure you want to delete this household?')) return;
    this.householdService.deleteHousehold(id).subscribe(() => {
      this.loadHouseholds();
    });
  }
}
