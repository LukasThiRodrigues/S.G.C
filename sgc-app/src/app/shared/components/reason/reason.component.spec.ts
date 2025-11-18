import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectReasonDialogComponent } from './reason.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

describe('ReasonComponent', () => {
  let component: RejectReasonDialogComponent;
  let fixture: ComponentFixture<RejectReasonDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RejectReasonDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        RejectReasonDialogComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should make form valid when reason is filled', () => {
    component.form.controls['reason'].setValue('Test reason');
    expect(component.form.valid).toBeTrue();
  });

  it('should close dialog with reason on submit when form is valid', () => {
    component.form.controls['reason'].setValue('Some reason');

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith('Some reason');
  });

  it('should NOT close dialog on submit when form is invalid', () => {
    component.form.controls['reason'].setValue('');

    component.onSubmit();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with null on cancel', () => {
    component.onCancel();

    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
