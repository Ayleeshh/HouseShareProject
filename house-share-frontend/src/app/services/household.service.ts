import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Household } from '../models/household';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {

  // Base URL for all household API calls
  private apiUrl = 'http://localhost:3000/households';

  constructor(private http: HttpClient) {}

  // Creates new household
  createHousehold(household: Household): Observable<Household> {
    return this.http.post<Household>(this.apiUrl, household);
  }

  // Returns all households
  getHouseholds(): Observable<Household[]> {
    return this.http.get<Household[]>(this.apiUrl);
  }

  // Fully updates a household
  updateHousehold(id: string, data: Partial<Household>): Observable<Household> {
    return this.http.put<Household>(`${this.apiUrl}/${id}`, data);
  }

  // Deletes a household
  deleteHousehold(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // No single household endpoint exists, so fetches all households
  // and finds the matching one by ID on the frontend
  getHousehold(id: string): Observable<Household> {
    return this.getHouseholds().pipe(
      map((households: Household[]) => {
        const found = households.find(h => h._id === id);
        if (!found) throw new Error('Household not found');
        return found;
      })
    );
  }
}
