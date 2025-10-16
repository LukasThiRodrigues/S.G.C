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
import { StatusComponent } from '../../shared/components/status/status.component';
import { RequestService } from '../../services/request.service';

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
    NavbarComponent,
    StatusComponent
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'creator', 'supplier', 'createdAt', 'description', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Request>();
  searchText: string = '';
  page: number = 1;
  limit: number = 10;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private service: RequestService,
  ) {}

  public ngOnInit() {
    this.loadRequests();
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchText = filterValue;
    this.page = 1;
    this.loadRequests();
  }

  public edit(request: Request) {
    this.router.navigate(['/request/edit/', request.id]);
  }

  public cancel(request: Request) {
    request.status = StatusRequest.Canceled;

    this.service.update(request).subscribe({
      next: () => {
        this.loadRequests();
      }
    })
  }

  public create() {
    this.router.navigate(['/request/edit']);
  }

  private loadRequests() {
    this.service.findAll(this.page, this.limit, this.searchText).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.requests;

        if (this.paginator) {
          this.paginator.length = res.total;
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

}