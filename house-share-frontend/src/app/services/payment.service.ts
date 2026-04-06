import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // Base URL for all payment API calls
  private apiUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) {}

  // Submits new payment to backend
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  // Returns all payments made by a member
  getPaymentsByMember(memberId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/member/${memberId}`);
  }

}
