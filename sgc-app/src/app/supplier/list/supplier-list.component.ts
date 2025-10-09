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
import { StatusComponent } from '../../shared/components/status/status.component';
import { SupplierService } from '../../services/supplier.service';

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
    NavbarComponent,
    StatusComponent
  ],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  displayedColumns: string[] = ['cnpj', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<Supplier>();
  searchText: string = '';
  page: number = 1;
  limit: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private service: SupplierService) { }

  public ngOnInit() {
    this.loadSuppliers();
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchText = filterValue;
    this.page = 1;
    this.loadSuppliers();
  }

  public edit(id: number) {
    this.router.navigate(['/supplier/edit/', id]);
  }

  public inactive(supplier: Supplier) {
    supplier.status = SupplierStatus.Inactive;

    this.service.update(supplier).subscribe({
      next: () => {
        this.loadSuppliers();
      },
    })
  }

  public active(supplier: Supplier) {
    supplier.status = SupplierStatus.Active;

    this.service.update(supplier).subscribe({
      next: () => {
        this.loadSuppliers();
      },
    })
  }

  public delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.loadSuppliers();
      },
      error: (err) => {
        console.error('Erro ao excluir fornecedor:', err);
      }
    });
  }

  public create() {
    this.router.navigate(['/supplier/edit']);
  }

  private loadSuppliers() {
    this.service.findAll(this.page, this.limit, this.searchText).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.suppliers;

        if (this.paginator) {
          this.paginator.length = res.total;
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedores:', err);
      }
    });
  }

}