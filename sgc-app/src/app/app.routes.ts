import { Routes } from '@angular/router';
import { LoginComponent } from './login/login-component';
import { RequestComponent } from './request/request-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'requests', component: RequestComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
