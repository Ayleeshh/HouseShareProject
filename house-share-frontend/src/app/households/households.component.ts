import { Component } from '@angular/core';
import { HouseholdService } from '../services/household.service';
import {Household} from '../models/household'
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-households',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './households.component.html',
  styleUrl: './households.component.css'
})

export class HouseholdsComponent {
  households: Household[] = [];
  newHouseholdName = '';

  constructor(private householdService: HouseholdService) {}

  ngOnInit() {
    this.loadHouseholds();
  }

  loadHouseholds() {
    this.householdService.getHouseholds().subscribe((res) => {
      this.households = res;
    });
  }

  createHousehold() {
    if (!this.newHouseholdName) return;
    this.householdService
      .createHousehold({_id: "", members: [], name: this.newHouseholdName })
      .subscribe(() => {
        this.newHouseholdName = '';
        this.loadHouseholds();
      });
  }
}
