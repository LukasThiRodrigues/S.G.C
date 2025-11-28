import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let mockRouteParams$: Subject<any>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login')
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
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email and password fields', () => {
    const email = component.email;
    const password = component.password;

    expect(email?.valid).toBeFalse();
    expect(password?.valid).toBeFalse();

    email?.setValue('user@test.com');
    password?.setValue('123456');

    expect(component.loginForm.valid).toBeTrue();
  });

});
