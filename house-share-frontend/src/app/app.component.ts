import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberService } from './services/member.service';
import { Member } from './models/member';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: Member | null = null;
  dropdownOpen = false;

  constructor(public memberService: MemberService) {}

  ngOnInit() {
    this.memberService.currentUser$.subscribe((user: Member | null) => {
      this.currentUser = user;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  selectUser(id: string) {
    this.memberService.switchUser(id);
    this.dropdownOpen = false;
  }

  // Close dropdown if user clicks anywhere outside
  @HostListener('document:keydown.escape')
  onEscape() {
    this.dropdownOpen = false;
  }
}
