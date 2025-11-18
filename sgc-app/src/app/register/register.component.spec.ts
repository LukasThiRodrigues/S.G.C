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

  it('should mark form invalid if passwords don’t match', () => {
    component.registerForm.setValue({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      repeatPassword: '654321',
    });

    component.onSubmit();

    expect(component.registerForm.invalid).toBeTrue();
    expect(component.errorMessage).toBeNull();
  });

  it('should call authService.register when form is valid', () => {
    authServiceMock.register.and.returnValue(of({}));

    component.registerForm.setValue({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      repeatPassword: '123456',
    });

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
  });

  it('should navigate to login on successful register', fakeAsync(() => {
    authServiceMock.register.and.returnValue(of({}));

    component.registerForm.setValue({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      repeatPassword: '123456',
    });

    component.onSubmit();

    tick(1500); // simula o delay

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show conflict message if email already exists', () => {
    authServiceMock.register.and.returnValue(
      throwError(() => ({ status: 409 }))
    );

    component.registerForm.setValue({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      repeatPassword: '123456',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Este e-mail já está cadastrado.');
  });

  it('should show generic error message', () => {
    authServiceMock.register.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.registerForm.setValue({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
      repeatPassword: '123456',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Erro ao criar conta. Tente novamente.');
  });
});
