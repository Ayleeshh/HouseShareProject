import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { HouseholdService } from '../services/household.service';
import { Household } from '../models/household';

@Component({
  selector: 'app-households', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './households.component.html',
  styleUrl: './households.component.css'
})
export class HouseholdsComponent implements OnInit {
  // Tracks which tab is currently visible: create, view, or edit
  activeTab: 'create' | 'view' | 'edit' = 'view';

  // List of all households fetched from the backend
  households: Household[] = [];

  // Holds the name typed into the create form
  newHouseholdName = '';

  // Holds the household currently being edited
  selectedHousehold: Household | null = null;

  // Injects the household service
  constructor(private householdService: HouseholdService) {}

  // Runs when the component loads — fetches all households
  ngOnInit() {
    this.loadHouseholds();
  }

  // Fetches all households from the backend and stores them
  loadHouseholds() {
    this.householdService.getHouseholds().subscribe(res => this.households = res);
  }

  // Switches the visible tab
  setTab(tab: 'create' | 'view' | 'edit') {
    this.activeTab = tab;
  }

  // Sends the new household name to the backend, then resets the form and switches to view tab
  createHousehold() {
    if (!this.newHouseholdName) return;
    this.householdService.createHousehold({ name: this.newHouseholdName }).subscribe(() => {
      this.newHouseholdName = '';
      this.loadHouseholds();
      this.setTab('view');  // switch to view after creating
    });
  }

  // Copies the selected household and switches to the edit tab
  selectHousehold(household: Household) {
    this.selectedHousehold = { ...household };
    this.setTab('edit');  // switch to edit tab when Edit clicked
  }

  // Sends the updated household name to the backend, then switches back to view tab
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

  // Asks for confirmation then deletes the household and refreshes the list
  deleteHousehold(id: string) {
    if (!confirm('Are you sure you want to delete this household?')) return;
    this.householdService.deleteHousehold(id).subscribe(() => {
      this.loadHouseholds();
    });
  }
}
