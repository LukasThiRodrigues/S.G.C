import { Component, OnInit } from '@angular/core';
import { Pedido, StatusPedido } from '../../shared/models/request.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-quotation-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './quotation-edit.component.html',
  styleUrl: './quotation-edit.component.scss'
})
export class QuotationEditComponent implements OnInit {
  pedidoForm: FormGroup;
  isEditMode = false;
  pedidoId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pedidoForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.pedidoId = +params['id'];
        this.load(this.pedidoId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      codigo: ['', Validators.required],
      dataEmissao: [new Date().toISOString().substring(0, 10), Validators.required],
      dataEntrega: [''],
      fornecedor: ['', Validators.required],
      status: [StatusPedido.Pendente, Validators.required],
      itens: this.fb.array([this.createItemForm()]),
      total: [0]
    });
  }

  createItemForm(): FormGroup {
    return this.fb.group({
      produto: ['', Validators.required],
      unidade: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      precoUnitario: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });
  }

  get itens(): FormArray {
    return this.pedidoForm.get('itens') as FormArray;
  }

  addItem() {
    this.itens.push(this.createItemForm());
  }

  removeItem(index: number) {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
      this.calculateTotal();
    }
  }

  calculateTotalItem(index: number) {
    const item = this.itens.at(index);
    const quantidade = item.get('quantidade')?.value || 0;
    const precoUnitario = item.get('precoUnitario')?.value || 0;
    const total = quantidade * precoUnitario;
    item.patchValue({ total });
    this.calculateTotal();
  }

  calculateTotal() {
    const total = this.itens.controls.reduce((sum, item) => {
      return sum + (item.get('total')?.value || 0);
    }, 0);
    this.pedidoForm.patchValue({ total });
  }

  load(id: number) {
    const pedidoMock: Pedido = {
      id: 1,
      codigo: '000001',
      dataEmissao: new Date(),
      criador: 'João Silva',
      fornecedor: 'Fornecedor Exemplo Ltda',
      status: StatusPedido.Pendente,
      itens: [
        { produto: 'Produto A', quantidade: 2, unidade: 'UN', precoUnitario: 100, total: 200 },
        { produto: 'Produto B', quantidade: 1, unidade: 'UN', precoUnitario: 50, total: 50 }
      ],
      total: 250
    };

    while (this.itens.length) {
      this.itens.removeAt(0);
    }

    pedidoMock.itens.forEach(item => {
      this.itens.push(this.fb.group(item));
    });

    this.pedidoForm.patchValue(pedidoMock);
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      console.log('Pedido salvo:', this.pedidoForm.value);
      this.router.navigate(['/quotations']);
    }
  }

  cancel() {
    this.router.navigate(['/quotations']);
  }
}
