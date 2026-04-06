import { Component, OnInit, HostListener } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberService } from './services/member.service';
import { Member } from './models/member';

@Component({
  selector: 'app-root', // HTML tag to render component
  standalone: true, // Component doesn't need to be declared in a module
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Tracks the currently logged-in user to display in the navbar
  currentUser: Member | null = null;

  // Controls whether the user switcher dropdown is open or closed
  dropdownOpen = false;

  constructor(
    public memberService: MemberService, // public so the HTML template can access it directly
    private router: Router
  ) {}

  // Subscribes to current user — updates whenever the user is switched
  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
    });
  }

  // Toggles the user switcher dropdown open or closed
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Switches the active user and closes the dropdown
  selectUser(id: string) {
    this.memberService.switchUser(id);
    this.dropdownOpen = false;
  }

  // Closes the dropdown when the user presses the Escape key
  @HostListener('document:keydown.escape')
  onEscape() {
    this.dropdownOpen = false;
  }

  // Navigates to the setup page and closes the dropdown
  goToSetup() {
    this.dropdownOpen = false;
    this.router.navigate(['/setup']);
  }
}
