import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNavbarComponent } from './shared/site-navbar.component';

@Component({
  imports: [RouterOutlet, SiteNavbarComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('exam-platform-frontend');
}
