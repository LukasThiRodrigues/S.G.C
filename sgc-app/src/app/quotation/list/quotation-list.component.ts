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
import { Quotation, StatusQuotation } from '../../shared/models/quotation.model';

@Component({
  selector: 'app-quotations-list',
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
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'creator', 'description', 'createdAt', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Quotation>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  quotations: Quotation[] = [
    {
      id: 1,
      code: '000001',
      creator: 'João Silva',
      description: 'Descrição Cotação 1',
      suppliers: [],
      itens: [],
      createdAt: new Date('2024-01-15'),
      status: StatusQuotation.GeneratedRequest,
      total: 1250.50
    },
    {
      id: 2,
      code: '000002',
      creator: 'Maria Santos',
      description: 'Descrição Cotação 2',
      suppliers: [],
      itens: [],
      createdAt: new Date('2024-01-16'),
      status: StatusQuotation.Pending,
      total: 890.00
    },
    {
      id: 3,
      code: '000003',
      creator: 'Carlos Oliveira',
      description: 'Descrição Cotação 3',
      suppliers: [],
      itens: [],
      createdAt: new Date('2024-01-17'),
      status: StatusQuotation.InDecision,
      total: 2450.75
    }
  ];

  constructor(private router: Router) {}

  public ngOnInit() {
    this.dataSource.data = this.quotations;
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

  public edit(quotation: Quotation) {
    this.router.navigate(['/quotation/edit/', quotation.id]);
  }

  public delete(quotation: Quotation) {
    // Lógica de exclusão aqui
  }

  public create() {
    this.router.navigate(['/quotation/edit']);
  }

}