import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-setup', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
  // Form fields bound to the HTML inputs
  name = '';
  email = '';
  householdName = '';

  // Controls error message and loading state in the UI
  error = '';
  loading = false;

  // Injects HttpClient directly here instead of a service — used for the setup one-time flow
  constructor(
    private http: HttpClient,
    private memberService: MemberService,
    private router: Router
  ) {}

  create() {
    // Validates all fields are filled before doing anything
    if (!this.name || !this.email || !this.householdName) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    // Step 1 — create the household first so get its _id
    this.http.post<any>('http://localhost:3000/households', { name: this.householdName })
      .subscribe({
        next: (household) => {

          // Step 2 — create the first member as admin, linked to the new household
          this.http.post<any>('http://localhost:3000/members', {
            name: this.name,
            email: this.email,
            householdId: household._id, // links member to the household just created
            isAdmin: true,
            isActive: true
          }).subscribe({
            next: (newMember) => {

              // Step 3 — reload the full members list so the app is up to date
              this.memberService.getMembers().subscribe(members => {

                // Step 4 — set the new member as the current logged-in user and redirect to dashboard
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
