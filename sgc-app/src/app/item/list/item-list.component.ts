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
import { Item } from '../../shared/models/item.model';

@Component({
  selector: 'app-item-list',
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
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'item', 'unit', 'price', 'actions'];
  dataSource = new MatTableDataSource<Item>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  items: Item[] = [
    {
      id: 1,
      item: 'Item A',
      code: 'A001',
      unit: 'UN',
      quantity: 10,
      price: 15.5,
      total: 155
    },
    {
      id: 2,
      item: 'Item B',
      code: 'B002',
      unit: 'CX',
      quantity: 1,
      price: 20,
      total: 20
    },
    {
      id: 3,
      item: 'Item C',
      code: 'C003',
      unit: 'UN',
      quantity: 1,
      price: 150,
      total: 150
    }
  ];

  constructor(private router: Router) {}

  public ngOnInit() {
    this.dataSource.data = this.items;
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

  public edit(item: Item) {
    this.router.navigate(['/item/edit/', item.id]);
  }

  public delete(item: Item) {
    // Lógica de exclusão aqui
  }

  public create() {
    this.router.navigate(['/item/edit']);
  }

}