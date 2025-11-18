import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuth: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { url: '/requests' });

    mockAuth = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ sub: 1 }),
      findOne: jasmine.createSpy('findOne').and.returnValue(
        of({ id: 1, name: 'User Test', supplierId: null })
      )
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuth }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user and set isSupplier on init', () => {
    expect(mockAuth.getCurrentUser).toHaveBeenCalled();
    expect(mockAuth.findOne).toHaveBeenCalledWith(1);
    expect(component.isSupplier).toBeFalse();
  });

  it('should navigate to requests', () => {
    component.requests();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/requests']);
  });

  it('should navigate to quotations', () => {
    component.quotations();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quotations']);
  });

  it('should navigate to suppliers', () => {
    component.suppliers();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });

  it('should navigate to items', () => {
    component.items();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/items']);
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
