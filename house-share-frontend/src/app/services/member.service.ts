import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Member} from "../models/member";

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private apiUrl = 'http://localhost:3000/members';

  constructor(private http: HttpClient) {}

  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }
}
