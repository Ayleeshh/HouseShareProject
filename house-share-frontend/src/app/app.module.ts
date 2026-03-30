// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';        // For ngModel
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';      // For routing

import { AppComponent } from './app.component';
import { BillsComponent } from './bills/bills.component';
import { BillService } from './services/bill.service';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,         // required for ngModel
    HttpClientModule,    // required for HTTP
    RouterModule.forRoot([   // optional routing
      {path: '', component: BillsComponent},
      {path: 'bills', component: BillsComponent},
    ]),
    BillsComponent,
    AppComponent,
  ],
  providers: [BillService],
  bootstrap: [AppComponent]
})
export class AppModule {}
