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
import { ItemService } from '../../services/item.service';

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
  displayedColumns: string[] = ['code', 'item', 'description', 'unit', 'actions'];
  dataSource = new MatTableDataSource<Item>();
  searchText: string = '';
  page: number = 1;
  limit: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private service: ItemService) { }

  public ngOnInit() {
    this.loadItems();
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchText = filterValue;
    this.page = 1;
    this.loadItems();
  }

  public edit(id: number) {
    this.router.navigate(['/item/edit/', id]);
  }

  public delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.loadItems();
      },
      error: (err) => {
        console.error('Erro ao excluir item:', err);
      }
    });
  }

  public create() {
    this.router.navigate(['/item/edit']);
  }

  private loadItems() {
    this.service.findAll(this.page, this.limit, this.searchText).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;

        if (this.paginator) {
          this.paginator.length = res.total;
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar itens:', err);
      }
    });
  }

}