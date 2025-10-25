import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectReasonDialogComponent } from './reason.component';

describe('Reason', () => {
  let component: RejectReasonDialogComponent;
  let fixture: ComponentFixture<RejectReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectReasonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
