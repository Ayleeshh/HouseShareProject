import { Component } from '@angular/core';
import { BillTypesComponent } from './bill-types/bill-types.component';
import { BillsComponent } from './bills/bills.component';
import {MembersComponent} from "./members/members.component";
import {HouseholdsComponent} from "./households/households.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BillTypesComponent, BillsComponent, MembersComponent, HouseholdsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // 🔴 Replace this with a real ID from your MongoDB households collection
  // householdId = 'TEMP_HOUSEHOLD_ID';
}
