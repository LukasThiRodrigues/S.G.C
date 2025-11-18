import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationListComponent } from './quotation-list.component';
import { of, Subject, throwError } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuotationService } from '../../services/quotation.service';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';
import { MockPaginator } from '../../shared/mocks/mockPaginator';
import { MockSort } from '../../shared/mocks/mockSort';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusQuotation } from '../../shared/models/quotation.model';

describe('QuotationListComponent', () => {
  let component: QuotationListComponent;
  let fixture: ComponentFixture<QuotationListComponent>;
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
      findAll: jasmine.createSpy('findAll'),
      update: jasmine.createSpy('update').and.returnValue(of(true))
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 1 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(of({ id: 1, name: 'User Test', supplierId: null }))
    };

    await TestBed.configureTestingModule({
      imports: [QuotationListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QuotationService, useValue: mockService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatPaginator, useClass: MockPaginator },
        { provide: MatSort, useClass: MockSort }
      ]
    }).overrideComponent(QuotationListComponent, {
      set: {
        imports: [
          CommonModule,
        ]
      }
    }).compileComponents();

    TestBed.overrideComponent(QuotationListComponent, {
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
          MockNavbarComponent
        ]
      }
    });

    fixture = TestBed.createComponent(QuotationListComponent);
    component = fixture.componentInstance;

    component.paginator = new MockPaginator() as any;
    component.sort = new MockSort() as any;

    mockService.findAll.and.returnValue(
      of({ quotations: [], total: 0 })
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quotations on init', () => {
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockAuthService.findOne).toHaveBeenCalledWith(1);
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10, '', null);
  });

  it('should apply filter', () => {
    const fakeEvent = { target: { value: 'abc' } } as any;

    component.applyFilter(fakeEvent);

    expect(mockService.findAll).toHaveBeenCalledWith(1, 10, 'abc', null);
    expect(component.searchText).toBe('abc');
  });

  it('should navigate to edit page', () => {
    component.edit({ id: 55 } as any);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quotation/edit/', 55]);
  });

  it('should navigate to create page', () => {
    component.create();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quotation/edit']);
  });

  it('should cancel quotation and reload list', () => {
    mockService.findAll.calls.reset();
    mockService.update.and.returnValue(of(true));

    const quotation = { id: 10, status: null } as any;

    component.cancel(quotation);

    expect(quotation.status).toBe(StatusQuotation.Canceled);
    expect(mockService.update).toHaveBeenCalledWith(quotation);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should handle loadQuotations error', () => {
    spyOn(console, 'error');

    mockService.findAll.and.returnValue(
      throwError(() => new Error('Erro ao carregar'))
    );

    (component as any).loadQuotations();

    expect(console.error).toHaveBeenCalled();
  });

});
