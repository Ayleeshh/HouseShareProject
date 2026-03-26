import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  imports: [CommonModule]
})
export class WelcomeComponent {
  studentName = "Sarah";

  courseName = "Web Dev";
  roomNumber = "B12";

  age = 18;

  modules = ['Angular', 'Java', 'Databases'];

  showMessage() {
    alert('Button clicked');
  }

  bill = {
    type: 'Electricity',
    amount: 120
  };

  heading = 'Welcome to Angular';
  description = 'This is my first Angular app.';

  members = ['Anna', 'John', 'Mark', 'Lisa'];

  getWelcomeMessage() {
    return 'Welcome to the House Share App';
  }

  bills = ['Electricity', 'Internet', 'Bins'];

  addBill() {
    alert('New bill will be added later');
  }



}
