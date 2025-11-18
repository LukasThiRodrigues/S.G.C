import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusComponent } from './status.component';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct config for valid quotation status', () => {
    component.type = 'quotation';
    component.status = 'pending';

    const config = component.getStatusConfig();

    expect(config.color).toBe('orange');
    expect(config.label).toBe('Pendente');
  });

  it('should return correct config for valid supplier status', () => {
    component.type = 'supplier';
    component.status = 'active';

    const config = component.getStatusConfig();

    expect(config.color).toBe('green');
    expect(config.label).toBe('Ativo');
  });

  it('should return correct config for valid request status', () => {
    component.type = 'request';
    component.status = 'delivered';

    const config = component.getStatusConfig();

    expect(config.color).toBe('green');
    expect(config.label).toBe('Entregue');
  });

  it('should return "Desconhecido" when status does not exist in the map', () => {
    component.type = 'request';
    component.status = 'foobar';

    const config = component.getStatusConfig();

    expect(config.label).toBe('Desconhecido');
    expect(config.color).toBe('gray');
  });

  it('should return "Tipo inválido" when type is invalid', () => {
    component.type = 'banana' as any;
    component.status = 'pending';

    const config = component.getStatusConfig();

    expect(config.label).toBe('Tipo inválido');
    expect(config.color).toBe('gray');
  });

  it('getStatusColor should return the correct color', () => {
    component.type = 'quotation';
    component.status = 'draft';

    expect(component.getStatusColor()).toBe('gray');
  });

  it('getStatusLabel should return the correct label', () => {
    component.type = 'quotation';
    component.status = 'generatedRequest';

    expect(component.getStatusLabel()).toBe('Pedido Gerado');
  });

});
