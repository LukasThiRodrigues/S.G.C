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
import { Pedido, StatusPedido } from '../../shared/models/request.model';
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
  displayedColumns: string[] = ['codigo', 'criador', 'fornecedor', 'dataEmissao', 'status', 'total', 'acoes'];
  dataSource = new MatTableDataSource<Pedido>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Dados de exemplo
  pedidos: Pedido[] = [
    {
      id: 1,
      codigo: '000001',
      criador: 'João Silva',
      fornecedor: 'Fornecedor A',
      itens: [],
      dataEmissao: new Date('2024-01-15'),
      status: StatusPedido.Entregue,
      total: 1250.50
    },
    {
      id: 2,
      codigo: '000002',
      criador: 'Maria Santos',
      fornecedor: 'Fornecedor B',
      itens: [],
      dataEmissao: new Date('2024-01-16'),
      status: StatusPedido.Pendente,
      total: 890.00
    },
    {
      id: 3,
      codigo: '000003',
      criador: 'Carlos Oliveira',
      fornecedor: 'Fornecedor C',
      itens: [],
      dataEmissao: new Date('2024-01-17'),
      status: StatusPedido.Cancelado,
      total: 2450.75
    }
  ];

  constructor(private router: Router) {}

  public ngOnInit() {
    this.dataSource.data = this.pedidos;
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

  public edit(pedido: Pedido) {
    this.router.navigate(['/request/edit/', pedido.id]);
  }

  public delete(pedido: Pedido) {
    // Lógica de exclusão aqui
  }

  public create() {
    this.router.navigate(['/request/edit']);
  }

}