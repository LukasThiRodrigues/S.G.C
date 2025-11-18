import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RequestEditComponent } from './request-edit.component';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { of, Subject } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { SupplierService } from '../../services/supplier.service';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { StatusRequest } from '../../shared/models/request.model';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';

describe('RequestEditComponent', () => {
  let component: RequestEditComponent;
  let fixture: ComponentFixture<RequestEditComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockAuthService: any;
  let mockItemService: any;
  let mockSupplierService: any;
  let mockRequestService: any;
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

    mockItemService = { findAll: jasmine.createSpy().and.returnValue(of({ items: [] })) };
    mockSupplierService = { findAll: jasmine.createSpy().and.returnValue(of({ suppliers: [] })) };
    mockRequestService = {
      findOne: jasmine.createSpy('findOne'),
      create: jasmine.createSpy('create'),
      update: jasmine.createSpy('update')
    };
    mockDialog = { open: jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) }) };

    await TestBed.configureTestingModule({
      imports: [RequestEditComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ItemService, useValue: mockItemService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: RequestService, useValue: mockRequestService },
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder
      ]
    }).compileComponents();

    TestBed.overrideComponent(RequestEditComponent, {
      set: {
        imports: [
          CommonModule,
          (await import('@angular/forms')).ReactiveFormsModule,
          RouterModule,
          MatAutocompleteModule,
          MockNavbarComponent
        ]
      }
    });

    fixture = TestBed.createComponent(RequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in new mode', fakeAsync(() => {
    routeParams$.next({});
    tick();
    expect(component.isEditMode).toBeFalse();
    expect(component.requestForm.get('createdAt')?.disabled).toBeTrue();
  }));

  it('should load request in edit mode', fakeAsync(() => {
    mockRequestService.findOne.and.returnValue(of({
      id: 10,
      code: 'REQ-10',
      createdAt: new Date().toISOString(),
      deliveredAt: null,
      supplier: { id: 2, name: 'Fornecedor X', cnpj: '123' },
      itens: [],
      status: StatusRequest.Pending,
      quotationId: null
    }));

    routeParams$.next({ id: 10 });
    tick();

    expect(component.isEditMode).toBeTrue();
    expect(mockRequestService.findOne).toHaveBeenCalledWith(10);
    expect(component.requestForm.get('code')?.disabled).toBeTrue();
  }));

  it('should navigate away when canceling (non-supplier)', () => {
    component.isSupplier = false;
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/requests']);
  });

  it('should open dialog when supplier refuses', fakeAsync(() => {
    component.isSupplier = true;
    component.requestId = 10;
    component.requestForm.patchValue({ status: StatusRequest.Pending });

    const afterClosed$ = new Subject<any>();
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ });

    mockRequestService.update.and.returnValue(of({ ok: true }));

    component.cancel();
    afterClosed$.next('Motivo X');
    tick();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockRequestService.update).toHaveBeenCalled();
  }));

  it('should search suppliers', () => {
    mockSupplierService.findAll.and.returnValue(of({
      suppliers: [{ id: 1, name: 'Sup', status: 'Active' }]
    }));

    component.searchSupplier({ target: { value: 'a' } } as any);

    expect(mockSupplierService.findAll).toHaveBeenCalled();
    expect(component.allSuppliers.length).toBe(1);
  });

  it('should search items', () => {
    mockItemService.findAll.and.returnValue(of({ items: [{ id: 1, item: 'Parafuso', unit: 'UN' }] }));

    component.searchItem({ target: { value: 'p' } } as any);

    expect(mockItemService.findAll).toHaveBeenCalled();
    expect(component.allItens.length).toBe(1);
  });

  it('should select item and update unit + total', () => {
    const selectedItem = { id: 1, item: 'Cabo', unit: 'M', price: 10 } as any;
    const firstItem = component.itens.at(0);

    firstItem.patchValue({ quantity: 2, price: 5 });

    component.onItemSelected(0, selectedItem);

    expect(firstItem.get('item')?.value.item).toBe('Cabo');
    expect(firstItem.get('unit')?.disabled).toBeTrue();
    expect(firstItem.get('total')?.value).toBe(10);
  });

  it('should check canRefuse', () => {
    component.isSupplier = true;
    component.requestForm.patchValue({ status: StatusRequest.Pending });
    expect(component.canRefuse()).toBeTrue();
  });

  it('should check canEdit', () => {
    component.requestForm.patchValue({ status: StatusRequest.Draft });
    expect(component.canEdit()).toBeTrue();
  });

});
