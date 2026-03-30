import { Routes } from '@angular/router';
import {BillsComponent} from "./bills/bills.component";

export const routes: Routes = [
  { path: '', component: BillsComponent },
  { path: 'bills', component: BillsComponent }
];
