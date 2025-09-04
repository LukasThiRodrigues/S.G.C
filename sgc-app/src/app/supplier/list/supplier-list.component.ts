import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Supplier, SupplierStatus } from '../../shared/models/supplier.model';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    NavbarComponent
  ],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  displayedColumns: string[] = ['cnpj', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<Supplier>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  suppliers: Supplier[] = [
    {
      id: 1,
      cnpj: '00.000.000/0001-00',
      name: 'Fornecedor A',
      status: SupplierStatus.Active
    },
    {
      id: 2,
      cnpj: '00.000.000/0002-00',
      name: 'Fornecedor B',
      status: SupplierStatus.Invited
    },
    {
      id: 1,
      cnpj: '00.000.000/0003-00',
      name: 'Fornecedor C',
      status: SupplierStatus.Inactive
    }
  ];

  constructor(private router: Router) {}

  public ngOnInit() {
    this.dataSource.data = this.suppliers;
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public edit(supplier: Supplier) {
    this.router.navigate(['/supplier/edit/', supplier.id]);
  }

  public delete(supplier: Supplier) {
    // Lógica de exclusão aqui
  }

  public create() {
    this.router.navigate(['/supplier/edit']);
  }

}