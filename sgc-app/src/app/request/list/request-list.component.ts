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
import { Request, StatusRequest } from '../../shared/models/request.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-requests-list',
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
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'creator', 'supplier', 'createdAt', 'description', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Request>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  requests: Request[] = [
    {
      id: 1,
      code: '000001',
      creator: 'João Silva',
      description: 'Pedido de teste',
      supplier: { id: 1, name: 'Fornecedor A', cnpj: '00.000.000/0001-00' },
      itens: [],
      createdAt: new Date('2024-01-15'),
      status: StatusRequest.Delivered,
      total: 1250.50
    },
    {
      id: 2,
      code: '000002',
      creator: 'Maria Santos',
      description: 'Pedido de teste 2',
      supplier: { id: 2, name: 'Fornecedor B', cnpj: '00.000.000/0002-00' },
      itens: [],
      createdAt: new Date('2024-01-16'),
      status: StatusRequest.Pending,
      total: 890.00
    },
    {
      id: 3,
      code: '000003',
      creator: 'Carlos Oliveira',
      description: 'Pedido de teste 3',
      supplier: { id: 3, name: 'Fornecedor C', cnpj: '00.000.000/0003-00' },
      itens: [],
      createdAt: new Date('2024-01-17'),
      status: StatusRequest.Canceled,
      total: 2450.75
    }
  ];

  constructor(private router: Router) {}

  public ngOnInit() {
    this.dataSource.data = this.requests;
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

  public edit(request: Request) {
    this.router.navigate(['/request/edit/', request.id]);
  }

  public delete(request: Request) {
    // Lógica de exclusão aqui
  }

  public create() {
    this.router.navigate(['/request/edit']);
  }

}