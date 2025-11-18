import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierListComponent } from './supplier-list.component';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { of, Subject } from 'rxjs';
import { SupplierStatus } from '../../shared/models/supplier.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { MockPaginator } from '../../shared/mocks/mockPaginator';
import { MockSort } from '../../shared/mocks/mockSort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusComponent } from '../../shared/components/status/status.component';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let fixture: ComponentFixture<SupplierListComponent>;
  let mockService: any;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRouteParams$: Subject<any>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouteParams$ = new Subject<any>();

    mockActivatedRoute = {
      params: mockRouteParams$.asObservable(),
      snapshot: { paramMap: { get: (_: string) => null } }
    };

    mockService = {
      findAll: jasmine.createSpy('findAll').and.returnValue(
        of({ suppliers: [{ id: 1, name: 'A', cnpj: '123', status: SupplierStatus.Active }], total: 1 })
      ),
      update: jasmine.createSpy('update').and.returnValue(of(true))
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 1 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(of({ id: 1, name: 'User Test', supplierId: null }))
    };

    await TestBed.configureTestingModule({
      imports: [SupplierListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SupplierService, useValue: mockService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatPaginator, useValue: MockPaginator },
        { provide: MatSort, useValue: MockSort },
      ]
    }).overrideComponent(SupplierListComponent, {
      set: {
        imports: [
          CommonModule
        ]
      }
    }).compileComponents();

    TestBed.overrideComponent(SupplierListComponent, {
      set: {
        imports: [
          CommonModule,
          (await import('@angular/forms')).ReactiveFormsModule,
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
          StatusComponent,
          MockNavbarComponent
        ]
      }
    });

    fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suppliers on init', () => {
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10, '');
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should apply filter and reload suppliers', () => {
    spyOn(component as any, 'loadSuppliers').and.callThrough();

    const event = { target: { value: 'abc' } } as any;

    component.applyFilter(event);

    expect(component.searchText).toBe('abc');
    expect(component.page).toBe(1);
    expect((component as any).loadSuppliers).toHaveBeenCalled();
  });

  it('should navigate to edit supplier', () => {
    component.edit(5);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/supplier/edit/', 5]);
  });

  it('should inactivate a supplier', () => {
    const supplier = { id: 1, name: 'A', status: SupplierStatus.Active } as any;

    mockService.update.and.returnValue(of({}));

    component.inactive(supplier);

    expect(supplier.status).toBe(SupplierStatus.Inactive);
    expect(mockService.update).toHaveBeenCalledWith(supplier);
    expect(mockService.findAll).toHaveBeenCalledTimes(2);
  });

  it('should activate a supplier', () => {
    const supplier = { id: 1, name: 'A', status: SupplierStatus.Inactive } as any;

    mockService.update.and.returnValue(of({}));

    component.active(supplier);

    expect(supplier.status).toBe(SupplierStatus.Active);
    expect(mockService.update).toHaveBeenCalledWith(supplier);
    expect(mockService.findAll).toHaveBeenCalledTimes(2);
  });

  it('should navigate to create supplier', () => {
    component.create();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/supplier/edit']);
  });
});
