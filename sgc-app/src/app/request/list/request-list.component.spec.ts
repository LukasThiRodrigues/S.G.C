import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { RequestListComponent } from './request-list.component';
import { StatusRequest } from '../../shared/models/request.model';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';

describe('RequestListComponent', () => {
  let component: RequestListComponent;
  let fixture: ComponentFixture<RequestListComponent>;
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
        of({
          requests: [
            {
              id: 1,
              code: "RQ001",
              creator: "User Test",
              supplier: "Fornecedor X",
              createdAt: new Date(),
              deliveredAt: null,
              description: "Pedido teste",
              status: StatusRequest.Pending,
              total: 100
            }
          ],
          total: 1
        })
      ),
      update: jasmine.createSpy('update').and.returnValue(of(true))
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 1 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(of({ id: 1, name: 'User Test', supplierId: null }))
    };

    await TestBed.configureTestingModule({
      imports: [RequestListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RequestService, useValue: mockService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatPaginator, useValue: MockPaginator },
        { provide: MatSort, useValue: MockSort },
      ]
    }).overrideComponent(RequestListComponent, {
      set: {
        imports: [
          CommonModule
        ]
      }
    }).compileComponents();

    TestBed.overrideComponent(RequestListComponent, {
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

    fixture = TestBed.createComponent(RequestListComponent);
    component = fixture.componentInstance;

    component.paginator = {
      length: 0
    } as MatPaginator;

    component.sort = {} as MatSort;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests on init', () => {
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockAuthService.findOne).toHaveBeenCalledWith(1);
    expect(mockService.findAll).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should navigate to edit page', () => {
    const req = { id: 10 } as any;
    component.edit(req);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/request/edit/', 10]);
  });

  it('should cancel a request', () => {
    const req: any = { status: StatusRequest.Pending };

    component.cancel(req);

    expect(req.status).toBe(StatusRequest.Canceled);
    expect(mockService.update).toHaveBeenCalledWith(req);
  });

  it('should finish a request', () => {
    const req: any = { status: StatusRequest.Pending };

    component.finish(req);

    expect(req.status).toBe(StatusRequest.Delivered);
    expect(req.deliveredAt instanceof Date).toBeTrue();
    expect(mockService.update).toHaveBeenCalledWith(req);
  });

  it('should filter requests', () => {
    const event = { target: { value: "abc" } } as any;
    component.applyFilter(event);

    expect(component.searchText).toBe("abc");
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return false for cannot cancel delivered', () => {
    const req: any = { status: StatusRequest.Delivered };
    expect(component.canCancel(req)).toBeFalse();
  });

  it('should return true when request can be canceled', () => {
    const req: any = { status: StatusRequest.Pending };
    expect(component.canCancel(req)).toBeTrue();
  });

});
