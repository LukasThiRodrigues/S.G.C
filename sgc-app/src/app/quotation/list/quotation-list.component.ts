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
import { StatusComponent } from '../../shared/components/status/status.component';
import { QuotationService } from '../../services/quotation.service';

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
    NavbarComponent,
    StatusComponent
  ],
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'creator', 'description', 'createdAt', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<Quotation>();
  searchText: string = '';
  page: number = 1;
  limit: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private service: QuotationService) { }

  public ngOnInit() {
    this.loadQuotations();
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchText = filterValue;
    this.page = 1;
    this.loadQuotations();
  }

  public edit(quotation: Quotation) {
    this.router.navigate(['/quotation/edit/', quotation.id]);
  }

  public cancel(quotation: Quotation) {
    quotation.status = StatusQuotation.Canceled;

    this.service.update(quotation).subscribe({
      next: () => {
        this.loadQuotations();
      }
    })
  }

  public create() {
    this.router.navigate(['/quotation/edit']);
  }

  private loadQuotations() {
    this.service.findAll(this.page, this.limit, this.searchText).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.quotations;

        if (this.paginator) {
          this.paginator.length = res.total;
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar cotações:', err);
      }
    });
  }

}