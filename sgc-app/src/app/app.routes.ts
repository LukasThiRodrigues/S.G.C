import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RequestListComponent } from './request/list/request-list.component';
import { RequestEditComponent } from './request/edit/request-edit.component';
import { QuotationListComponent } from './quotation/list/quotation-list.component';
import { QuotationEditComponent } from './quotation/edit/quotation-edit.component';
import { SupplierListComponent } from './supplier/list/supplier-list.component';
import { SupplierEditComponent } from './supplier/edit/supplier-edit.component';
import { ItemListComponent } from './item/list/item-list.component';
import { ItemEditComponent } from './item/edit/item-edit.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'requests', component: RequestListComponent, canActivate: [AuthGuard] },
  { path: 'request/edit', component: RequestEditComponent, canActivate: [AuthGuard] },
  { path: 'request/edit/:id', component: RequestEditComponent, canActivate: [AuthGuard] },
  { path: 'quotations', component: QuotationListComponent, canActivate: [AuthGuard] },
  { path: 'quotation/edit', component: QuotationEditComponent, canActivate: [AuthGuard] },
  { path: 'quotation/edit/:id', component: QuotationEditComponent, canActivate: [AuthGuard] },
  { path: 'suppliers', component: SupplierListComponent, canActivate: [AuthGuard] },
  { path: 'supplier/edit', component: SupplierEditComponent, canActivate: [AuthGuard] },
  { path: 'supplier/edit/:id', component: SupplierEditComponent, canActivate: [AuthGuard] },
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'item/edit', component: ItemEditComponent, canActivate: [AuthGuard] },
  { path: 'item/edit/:id', component: ItemEditComponent, canActivate: [AuthGuard] },
];
