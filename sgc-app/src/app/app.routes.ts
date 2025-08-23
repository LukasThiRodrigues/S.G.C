import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RequestListComponent } from './request/list/request-list.component';
import { RequestEditComponent } from './request/edit/request-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'requests', component: RequestListComponent},
  { path: 'request/edit', component: RequestEditComponent },
  { path: 'request/edit/:id', component: RequestEditComponent },
];
