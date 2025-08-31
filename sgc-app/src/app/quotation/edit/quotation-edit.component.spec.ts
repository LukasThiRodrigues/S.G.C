import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationEditComponent } from './quotation-edit.component';


describe('QuotationEdit', () => {
  let component: QuotationEditComponent;
  let fixture: ComponentFixture<QuotationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
