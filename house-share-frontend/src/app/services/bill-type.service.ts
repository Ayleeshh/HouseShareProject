import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillType } from '../models/bill-type';

@Injectable({
  providedIn: 'root',
})
export class BillTypeService {
  private apiUrl = 'http://localhost:3000/bill-types';

  constructor(private http: HttpClient) {}

  createBillType(billType: BillType): Observable<BillType> {
    return this.http.post<BillType>(this.apiUrl, billType);
  }

  getBillTypes(): Observable<BillType[]> {
    return this.http.get<BillType[]>(this.apiUrl);
  }

  getBillTypesByHousehold(householdId: string): Observable<BillType[]> {
    return this.http.get<BillType[]>(`${this.apiUrl}/household/${householdId}`);
  }

  updateBillType(id: string, data: Partial<BillType>): Observable<BillType> {
    return this.http.patch<BillType>(`${this.apiUrl}/${id}`, data);
  }

  deleteBillType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
