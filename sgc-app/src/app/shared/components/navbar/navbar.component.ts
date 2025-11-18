import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isSupplier = false;

  constructor(private router: Router, private authService: AuthService) {}

  public ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    this.authService.findOne(user.sub).subscribe(user => {
      this.isSupplier = user.supplierId ? true : false;
    });
  }

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

  public logout() {
    this.router.navigate(['/login']);
  }

}
