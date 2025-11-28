import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let mockRouteParams$: Subject<any>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
      events: of()
    };

    mockRouteParams$ = new Subject<any>();

    mockActivatedRoute = {
      params: mockRouteParams$.asObservable(),
      snapshot: { paramMap: { get: (_: string) => null } }
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService) as any;
    routerMock = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
