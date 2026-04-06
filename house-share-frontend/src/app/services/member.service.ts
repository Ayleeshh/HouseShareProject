import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  // Base URL for all member API calls
  private apiUrl = 'http://localhost:3000/members';

  // List of all members available in the user switcher
  availableUsers: Member[] = [];

  // BehaviorSubject stores the current user and notifies any component watching it when it changes
  private currentUserSubject = new BehaviorSubject<Member | null>(null);

  // Public Observable that components subscribe to — they get notified when the user changes
  currentUser$ = this.currentUserSubject.asObservable();

  // Getter to read the current user value directly without subscribing
  get currentUser(): Member | null {
    return this.currentUserSubject.value;
  }

  // Loads all members as soon as the service is created
  constructor(private http: HttpClient) {
    this.loadMembers();
  }

  // Fetches all members and sets the first one as the current user by default
  loadMembers() {
    this.getMembers().subscribe((members: Member[]) => {
      this.availableUsers = members;
      if (members.length > 0) {
        this.currentUserSubject.next(members[0]); // auto-selects the first member
      }
    });
  }

  // Switches the current user to the member with the given ID
  switchUser(memberId: string) {
    const user = this.availableUsers.find(u => u._id === memberId);
    if (user) this.currentUserSubject.next(user); // notifies all subscribed components
  }

  // Creates a new member
  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  // Returns all members
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  // Returns all members in a household
  getMembersByHousehold(householdId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/household/${householdId}`);
  }

  // Partially updates member
  updateMember(id: string, data: Partial<Member>): Observable<Member> {
    return this.http.patch<Member>(`${this.apiUrl}/${id}`, data);
  }

  // Deletes a member
  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
