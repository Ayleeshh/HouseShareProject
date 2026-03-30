import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Household } from '../models/household';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  private apiUrl = 'http://localhost:3000/households';

  constructor(private http: HttpClient) {}

  createHousehold(household: Household): Observable<Household> {
    return this.http.post<Household>(this.apiUrl, household);
  }

  getHouseholds(): Observable<Household[]> {
    return this.http.get<Household[]>(this.apiUrl);
  }
}
