import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierEditComponent } from './supplier-edit.component';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { of, Subject } from 'rxjs';
import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../services/auth.service';
import { SupplierStatus } from '../../shared/models/supplier.model';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';

describe('SupplierEditComponent', () => {
  let component: SupplierEditComponent;
  let fixture: ComponentFixture<SupplierEditComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockAuthService: any;
  let mockService: any
  let mockDialog: any;
  let routeParams$: Subject<any>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    routeParams$ = new Subject<any>();

    mockActivatedRoute = {
      params: routeParams$.asObservable(),
      snapshot: { paramMap: { get: () => null } }
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy().and.returnValue({ sub: 1 }),
      findOne: jasmine.createSpy().and.returnValue(of({ id: 1, name: 'User X' }))
    };

    mockService = {
      findOne: jasmine.createSpy('findOne'),
      create: jasmine.createSpy('create'),
      update: jasmine.createSpy('update')
    };

    mockDialog = { open: jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) }) };

    await TestBed.configureTestingModule({
      imports: [SupplierEditComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SupplierService, useValue: mockService },
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder
      ]
    }).compileComponents();

    TestBed.overrideComponent(SupplierEditComponent, {
      set: {
        imports: [
          CommonModule,
          (await import('@angular/forms')).ReactiveFormsModule,
          RouterModule,
          MockNavbarComponent
        ]
      }
    });

    fixture = TestBed.createComponent(SupplierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call create on submit when not in edit mode', () => {
    mockService.create.and.returnValue(of({ id: 10 }));

    component.supplierForm.patchValue({
      cnpj: '222',
      name: 'Novo',
      contactEmail: 'novo@email.com',
      status: SupplierStatus.Inactive,
      creator: { id: 1, name: 'User Test' }
    });

    component.onSubmit();

    expect(mockService.create).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });

  it('should call update when in edit mode', () => {
    component.isEditMode = true;
    mockService.update.and.returnValue(of({ id: 50 }));

    component.supplierForm.patchValue({
      cnpj: '333',
      name: 'Editado',
      contactEmail: 'editado@email.com',
      status: SupplierStatus.Active,
      creator: { id: 1, name: 'User Test' }
    });

    component.onSubmit();

    expect(mockService.update).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });

});
