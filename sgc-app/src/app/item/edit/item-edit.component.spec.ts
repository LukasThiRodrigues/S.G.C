import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ItemEditComponent } from './item-edit.component';
import { ActivatedRoute, Router, RouterModule, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';

describe('ItemEditComponent', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRouteParams$: Subject<any>;
  let mockActivatedRoute: any;
  let mockItemService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouteParams$ = new Subject<any>();

    mockActivatedRoute = {
      params: mockRouteParams$.asObservable(),
      snapshot: { paramMap: { get: (_: string) => null } }
    };

    mockItemService = {
      findOne: jasmine.createSpy('findOne').and.returnValue(of({
        id: 1,
        item: 'Item Teste',
        creator: { id: 10, name: 'User' },
        description: 'desc',
        code: '001',
        unit: 'UN'
      })),
      create: jasmine.createSpy('create').and.returnValue(of({ id: 1 })),
      update: jasmine.createSpy('update').and.returnValue(of({ id: 1 }))
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 123 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(of({ id: 123, name: 'Test Creator' }))
    };

    await TestBed.configureTestingModule({
      imports: [
        ItemEditComponent,
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ItemService, useValue: mockItemService },
        { provide: AuthService, useValue: mockAuthService },
        FormBuilder
      ]
    }).overrideComponent(ItemEditComponent, {
        set: {
          imports: [
            CommonModule,
          ]
        }
      }).compileComponents();

    TestBed.overrideComponent(ItemEditComponent, {
      set: {
        imports: [
          CommonModule,
          (await import('@angular/forms')).ReactiveFormsModule,
          RouterModule,
          MockNavbarComponent
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load creator on init', () => {
    mockRouteParams$.next({});

    expect(mockAuthService.findOne).toHaveBeenCalledWith(123);

    const creator = component.itemForm.get('creator')?.value;
    expect(creator.name).toBe('Test Creator');
  });

  it('should enable edit mode and load item when route contains id', () => {
    mockRouteParams$.next({ id: 1 });

    expect(component.isEditMode).toBeTrue();
    expect(mockItemService.findOne).toHaveBeenCalledWith(1);

    expect(component.itemForm.get('item')?.disabled).toBeTrue();
    expect(component.itemForm.get('code')?.disabled).toBeTrue();
    expect(component.itemForm.get('unit')?.disabled).toBeTrue();
  });

  it('should call service.create on submit when not in edit mode', () => {
    component.isEditMode = false;

    component.itemForm.patchValue({
      item: 'abc',
      code: '123',
      unit: 'UN',
      creator: { id: 1, name: 'AAA' }
    });

    component.onSubmit();

    expect(mockItemService.create).toHaveBeenCalled();
  });

  it('should call service.update on submit when in edit mode', () => {
    component.isEditMode = true;

    component.itemForm.patchValue({
      id: 1,
      item: 'abc',
      code: '123',
      unit: 'UN',
      creator: { id: 1, name: 'AAA' }
    });

    component.onSubmit();

    expect(mockItemService.update).toHaveBeenCalled();
  });

  it('should navigate on cancel', () => {
    component.cancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/items']);
  });

});
