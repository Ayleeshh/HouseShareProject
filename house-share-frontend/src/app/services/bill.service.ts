import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private apiUrl = 'http://localhost:3000/bills';

  constructor(private http: HttpClient) {}

  createBill(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, bill);
  }

  getBillsByHousehold(householdId: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/household/${householdId}`);
  }

  deleteBill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateBill(id: string, data: Partial<Bill>): Observable<Bill> {
    return this.http.patch<Bill>(`${this.apiUrl}/${id}`, data);
  }

}
