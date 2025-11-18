import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { ItemService } from '../../services/item.service';
import { of, Subject, throwError } from 'rxjs';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MockNavbarComponent } from '../../shared/mocks/mockNavBarComponent';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MockPaginator } from '../../shared/mocks/mockPaginator';
import { MockSort } from '../../shared/mocks/mockSort';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let mockItemService: any;
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

    mockItemService = {
      findAll: jasmine.createSpy('findAll'),
      delete: jasmine.createSpy('delete')
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 123 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(of({ id: 123, name: 'Test Creator' }))
    };

    await TestBed.configureTestingModule({
      imports: [ItemListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ItemService, useValue: mockItemService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatPaginator, useClass: MockPaginator },
        { provide: MatSort, useClass: MockSort }
      ]
    }).overrideComponent(ItemListComponent, {
      set: {
        imports: [
          CommonModule,
        ]
      }
    }).compileComponents();

    TestBed.overrideComponent(ItemListComponent, {
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

    mockItemService.findAll.and.returnValue(of({ items: [], total: 0 }));
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;

    component.paginator = new MockPaginator() as any;
    component.sort = new MockSort() as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    const fakeResponse = {
      items: [
        { id: 1, code: 'A01', item: 'Teclado', description: 'Preto', unit: 'UN' }
      ],
      total: 1
    };

    mockItemService.findAll.and.returnValue(of(fakeResponse));

    component.ngOnInit();

    expect(mockItemService.findAll).toHaveBeenCalledWith(1, 10, '');
    expect(component.dataSource.data.length).toBe(1);
    expect(component.paginator.length).toBe(1);
  });

  it('should filter items when applyFilter is called', () => {
    const fakeResponse = { items: [], total: 0 };
    mockItemService.findAll.and.returnValue(of(fakeResponse));

    const event = { target: { value: 'abc' } } as any;

    component.applyFilter(event);

    expect(component.searchText).toBe('abc');
    expect(mockItemService.findAll).toHaveBeenCalledWith(1, 10, 'abc');
  });

  it('should navigate to edit page', () => {
    component.edit(5);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/item/edit/', 5]);
  });

  it('should navigate to create page', () => {
    component.create();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/item/edit']);
  });

  it('should delete an item and reload list', () => {
    mockItemService.delete.and.returnValue(of(true));
    mockItemService.findAll.and.returnValue(of({ items: [], total: 0 }));

    component.delete(10);

    expect(mockItemService.delete).toHaveBeenCalledWith(10);
    expect(mockItemService.findAll).toHaveBeenCalled();
  });

  it('should handle loadItems error gracefully', () => {
    spyOn(console, 'error');
    mockItemService.findAll.and.returnValue(
      throwError(() => new Error('Erro'))
    );

    component['loadItems']();

    expect(console.error).toHaveBeenCalled();
  });
});
