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

export interface Pedido {
  id: number;
  numero: string;
  solicitante: string;
  departamento: string;
  dataSolicitacao: Date;
  status: string;
  valorTotal: number;
}

@Component({
  selector: 'app-requests',
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
    MatInputModule
  ],
  templateUrl: './request-component.html',
  styleUrls: ['./request-component.scss']
})
export class RequestComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'solicitante', 'departamento', 'dataSolicitacao', 'status', 'valorTotal', 'acoes'];
  dataSource = new MatTableDataSource<Pedido>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Dados de exemplo
  pedidos: Pedido[] = [
    {
      id: 1,
      numero: 'PED-2024-001',
      solicitante: 'João Silva',
      departamento: 'TI',
      dataSolicitacao: new Date('2024-01-15'),
      status: 'Aprovado',
      valorTotal: 1250.50
    },
    {
      id: 2,
      numero: 'PED-2024-002',
      solicitante: 'Maria Santos',
      departamento: 'Financeiro',
      dataSolicitacao: new Date('2024-01-16'),
      status: 'Pendente',
      valorTotal: 890.00
    },
    {
      id: 3,
      numero: 'PED-2024-003',
      solicitante: 'Carlos Oliveira',
      departamento: 'Compras',
      dataSolicitacao: new Date('2024-01-17'),
      status: 'Rejeitado',
      valorTotal: 2450.75
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.dataSource.data = this.pedidos;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarPedido(pedido: Pedido) {
    console.log('Editar pedido:', pedido);
    // this.router.navigate(['/editar-pedido', pedido.id]);
  }

  excluirPedido(pedido: Pedido) {
    console.log('Excluir pedido:', pedido);
    // Lógica de exclusão aqui
  }

  novoPedido() {
    console.log('Novo pedido');
    // this.router.navigate(['/novo-pedido']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}