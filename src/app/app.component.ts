import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="topbar" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0d47a1;color:#fff;">
      <h1 style="margin:0;font-size:18px;">Transport Facility</h1>
      <nav style="display:flex;gap:12px;">
        <a routerLink="/add-ride" routerLinkActive="active" style="color:#fff;text-decoration:none;">Add Ride</a>
        <a routerLink="/pick-ride" routerLinkActive="active" style="color:#fff;text-decoration:none;">Pick Ride</a>       
      </nav>
    </header>
    <main class="container" style="max-width:560px;margin:16px auto;padding:0 12px;">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transport';
}
