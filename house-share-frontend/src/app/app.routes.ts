import { Routes } from '@angular/router';
import { BillsComponent } from "./bills/bills.component";
import { BillTypesComponent } from "./bill-types/bill-types.component";
import { MembersComponent } from "./members/members.component";
import { HouseholdsComponent } from "./households/households.component";
import { PaymentsComponent } from "./payments/payments.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import {MyBillsComponent} from "./my-bills/my-bills.component";
import {SetupComponent} from "./setup/setup.component";

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bill-types', component: BillTypesComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'members', component: MembersComponent },
  { path: 'households', component: HouseholdsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-bills', component: MyBillsComponent },
  { path: 'setup', component: SetupComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
