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

  it('should call AuthService.login when form is valid', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake' }));

    component.loginForm.setValue({
      email: 'user@test.com',
      password: '123456'
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: '123456'
    });
  });

  it('should navigate to /requests after successful login', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-token' }));

    component.loginForm.setValue({
      email: 'user@test.com',
      password: '123456'
    });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/requests']);
  });

  it('should show an error message when login fails', () => {
    authServiceMock.login.and.returnValue(
      throwError(() => ({
        error: { message: 'Credenciais inválidas' }
      }))
    );

    component.loginForm.setValue({
      email: 'user@test.com',
      password: '123456'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciais inválidas');
    expect(component.loading).toBeFalse();
  });

});
