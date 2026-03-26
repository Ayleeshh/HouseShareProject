import { Component } from '@angular/core';
import { Bills } from './bills/bills';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Bills],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'house-share-app';
}
