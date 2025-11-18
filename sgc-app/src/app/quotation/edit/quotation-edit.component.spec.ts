import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationEditComponent } from './quotation-edit.component';
import { provideRouter, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { SupplierService } from '../../services/supplier.service';
import { QuotationService } from '../../services/quotation.service';
import { ProposalService } from '../../services/proposal.service';
import { RequestService } from '../../services/request.service';
import { MatDialog } from '@angular/material/dialog';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('QuotationEditComponent', () => {
  let component: QuotationEditComponent;
  let fixture: ComponentFixture<QuotationEditComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockAuthService: any;
  let mockItemService: any;
  let mockSupplierService: any;
  let mockQuotationService: any;
  let mockProposalService: any;
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
    mockQuotationService = {
      create: jasmine.createSpy().and.returnValue(of({ id: 10 })),
      update: jasmine.createSpy().and.returnValue(of({ id: 10 })),
      findOne: jasmine.createSpy().and.returnValue(of({
        id: 99,
        description: 'Teste',
        code: 'Q01',
        createdAt: new Date().toISOString(),
        itens: [],
        suppliers: [],
        proposals: []
      }))
    };
    mockProposalService = { create: jasmine.createSpy().and.returnValue(of({})) };
    mockRequestService = { create: jasmine.createSpy().and.returnValue(of({ id: 123 })) };
    mockDialog = { open: jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) }) };

    await TestBed.configureTestingModule({
      imports: [QuotationEditComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ItemService, useValue: mockItemService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: QuotationService, useValue: mockQuotationService },
        { provide: ProposalService, useValue: mockProposalService },
        { provide: RequestService, useValue: mockRequestService },
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder
      ]
    }).compileComponents();

    TestBed.overrideComponent(QuotationEditComponent, {
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

    fixture = TestBed.createComponent(QuotationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quotation in edit mode', () => {
    routeParams$.next({ id: 99 });

    expect(mockQuotationService.findOne).toHaveBeenCalledWith(99);
    expect(component.isEditMode).toBeTrue();
  });

  it('should add item', () => {
    const before = component.itens.length;
    component.addItem();
    expect(component.itens.length).toBe(before + 1);
  });

  it('should remove item', () => {
    component.addItem();
    const before = component.itens.length;
    component.removeItem(0);
    expect(component.itens.length).toBe(before - 1);
  });

  it('should calculate total item', () => {
    const item = component.itens.at(0);

    item.patchValue({ quantity: 2, price: 5 });
    component.calculateTotalItem(0);

    expect(item.get('total')?.value).toBe(10);
    expect(component.quotationForm.get('total')?.value).toBe(10);
  });

  it('should navigate on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quotations']);
  });
});
