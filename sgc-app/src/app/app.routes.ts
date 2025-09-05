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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'requests', component: RequestListComponent},
  { path: 'request/edit', component: RequestEditComponent },
  { path: 'request/edit/:id', component: RequestEditComponent },
  { path: 'quotations', component: QuotationListComponent },
  { path: 'quotation/edit', component: QuotationEditComponent },
  { path: 'quotation/edit/:id', component: QuotationEditComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'supplier/edit', component: SupplierEditComponent },
  { path: 'supplier/edit/:id', component: SupplierEditComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'item/edit', component: ItemEditComponent },
  { path: 'item/edit/:id', component: ItemEditComponent },
];
