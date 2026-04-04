import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
  name = '';
  email = '';
  householdName = '';
  error = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private memberService: MemberService,
    private router: Router
  ) {}

  create() {
    if (!this.name || !this.email || !this.householdName) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    // Step 1: Create household
    this.http.post<any>('http://localhost:3000/households', { name: this.householdName })
      .subscribe({
        next: (household) => {
          // Step 2: Create member as admin
          this.http.post<any>('http://localhost:3000/members', {
            name: this.name,
            email: this.email,
            householdId: household._id,
            isAdmin: true,
            isActive: true
          }).subscribe({
            next: (newMember) => {
              // Step 3: Reload members list
              this.memberService.getMembers().subscribe(members => {
                // Step 4: Manually set available users and switch to new member
                this.memberService.availableUsers = members;
                this.memberService.switchUser(newMember._id);
                this.loading = false;
                this.router.navigate(['/dashboard']);
              });
            },
            error: () => {
              this.error = 'Failed to create member.';
              this.loading = false;
            }
          });
        },
        error: () => {
          this.error = 'Failed to create household.';
          this.loading = false;
        }
      });
  }
}
