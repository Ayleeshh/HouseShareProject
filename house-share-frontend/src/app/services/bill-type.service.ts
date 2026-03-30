import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillType } from '../models/bill-type';
import {Member} from "../models/member";


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

}
