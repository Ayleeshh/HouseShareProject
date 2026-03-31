import { Routes } from '@angular/router';
import {BillsComponent} from "./bills/bills.component";
import {BillTypesComponent} from "./bill-types/bill-types.component";
import {MembersComponent} from "./members/members.component";
import {HouseholdsComponent} from "./households/households.component";
import {PaymentsComponent} from "./payments/payments.component";
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },  // ← add this
  { path: 'bill-types', component: BillTypesComponent },
  { path: 'bills', component: BillsComponent },
  { path: 'members', component: MembersComponent },
  { path: 'households', component: HouseholdsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },  // ← start on admin
  { path: '**', redirectTo: 'admin' }
];
