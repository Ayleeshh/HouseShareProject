import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private apiUrl = 'http://localhost:3000/members';

  // ── Current User State ──
  availableUsers: Member[] = [];
  private currentUserSubject = new BehaviorSubject<Member | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): Member | null {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient) {
    this.loadMembers();
  }

  // ── User Switcher ──
  loadMembers() {
    this.getMembers().subscribe((members: Member[]) => {
      this.availableUsers = members;
      if (members.length > 0) {
        this.currentUserSubject.next(members[0]);
      }
    });
  }

  switchUser(memberId: string) {
    const user = this.availableUsers.find(u => u._id === memberId);
    if (user) this.currentUserSubject.next(user);
  }

  // ── API Calls ──
  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getMembersByHousehold(householdId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/household/${householdId}`);
  }

  updateMember(id: string, data: Partial<Member>): Observable<Member> {
    return this.http.patch<Member>(`${this.apiUrl}/${id}`, data);
  }

  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
