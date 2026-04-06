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

  // Creates bill type
  createBillType(billType: BillType): Observable<BillType> {
    return this.http.post<BillType>(this.apiUrl, billType);
  }

  // Returns all bill types
  getBillTypes(): Observable<BillType[]> {
    return this.http.get<BillType[]>(this.apiUrl);
  }

  // Returns bill type by household
  getBillTypesByHousehold(householdId: string): Observable<BillType[]> {
    return this.http.get<BillType[]>(`${this.apiUrl}/household/${householdId}`);
  }

  // Partially updates bill type
  updateBillType(id: string, data: Partial<BillType>): Observable<BillType> {
    return this.http.patch<BillType>(`${this.apiUrl}/${id}`, data);
  }

  // Deletes bill type
  deleteBillType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
