import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allocation } from '../models/allocation';

@Injectable({ providedIn: 'root' })
export class AllocationService {
  private apiUrl = 'http://localhost:3000/allocations';

  constructor(private http: HttpClient) {}

  // Returns allocation by bill id
  getAllocationsByBill(billId: string): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(`${this.apiUrl}/bill/${billId}`);
  }

  // Returns allocation by member id
  getAllocationsByMember(memberId: string): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(`${this.apiUrl}/member/${memberId}`);
  }

}
