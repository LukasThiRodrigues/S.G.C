import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  public isActive(routes: string[]): boolean {
    const activeRoute = routes.map(route => this.router.url.includes(route));

    return activeRoute.includes(true);
  }

  public requests() {
    this.router.navigate(['/requests']);
  }

  public quotations() {
    this.router.navigate(['/quotations']);
  }

  public suppliers() {
    this.router.navigate(['/suppliers']);
  }

  public items() {
    this.router.navigate(['/items']);
  }

  public profile() {
    this.router.navigate(['/profile']);
  }

  public logout() {
    this.router.navigate(['/login']);
  }

}
