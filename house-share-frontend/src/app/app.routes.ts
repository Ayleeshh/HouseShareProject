import { Routes } from '@angular/router';
import { Bills } from './bills/bills';

export const routes: Routes = [
  { path: '', component: Bills },
  { path: 'bills', component: Bills }
];
