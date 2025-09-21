import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Quotation, StatusQuotation } from '../../shared/models/quotation.model';
import { SupplierStatus } from '../../shared/models/supplier.model';

@Component({
  selector: 'app-quotation-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './quotation-edit.component.html',
  styleUrl: './quotation-edit.component.scss'
})
export class QuotationEditComponent implements OnInit {
  quotationForm: FormGroup;
  isEditMode = false;
  quotationId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.quotationForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.quotationId = +params['id'];
        this.load(this.quotationId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required],
      description: ['', Validators.required],
      suppliers: this.fb.array([this.createSupplierForm()]),
      status: [StatusQuotation.Pending, Validators.required],
      itens: this.fb.array([this.createItemForm()]),
      total: [0]
    });
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      unit: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });
  }

  private createSupplierForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }

  get itens(): FormArray {
    return this.quotationForm.get('itens') as FormArray;
  }

  get suppliers(): FormArray {
    return this.quotationForm.get('suppliers') as FormArray;
  }

  public addItem() {
    this.itens.push(this.createItemForm());
  }

  public addSupplier() {
    this.suppliers.push(this.createSupplierForm());
  }

  public removeItem(index: number) {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
      this.calculateTotal();
    }
  }

  public removeSupplier(index: number) {
    if (this.suppliers.length > 1) {
      this.suppliers.removeAt(index);
    }
  }

  public calculateTotalItem(index: number) {
    const item = this.itens.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const total = quantity * price;
    item.patchValue({ total });
    this.calculateTotal();
  }

  private calculateTotal() {
    const total = this.itens.controls.reduce((sum, item) => {
      return sum + (item.get('total')?.value || 0);
    }, 0);
    this.quotationForm.patchValue({ total });
  }

  private load(id: number) {
    const quotationMock: Quotation = {
      id: 1,
      code: '000001',
      createdAt: new Date(),
      creator: 'João Silva',
      description: 'Descrição da Cotação',
      suppliers: [
        { cnpj: '12345678000195', name: 'Fornecedor A', status: SupplierStatus.Active },
        { cnpj: '98765432000196', name: 'Fornecedor B', status: SupplierStatus.Active }
      ],
      status: StatusQuotation.Pending,
      itens: [
        { item: 'Produto A', description: 'Descrição do Produto A', code: '0001', quantity: 2, unit: 'UN', price: 100, total: 200 },
        { item: 'Produto B', description: 'Descrição do Produto B', code: '0002', quantity: 1, unit: 'UN', price: 50, total: 50 }
      ],
      total: 250
    };

    while (this.itens.length) {
      this.itens.removeAt(0);
    }

    quotationMock.itens.forEach(item => {
      this.itens.push(this.fb.group(item));
    });

    this.quotationForm.patchValue(quotationMock);
  }

  public onSubmit() {
    if (this.quotationForm.valid) {
      this.router.navigate(['/quotations']);
    }
  }

  public cancel() {
    this.router.navigate(['/quotations']);
  }
}
