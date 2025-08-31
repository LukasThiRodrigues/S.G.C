import { Component, OnInit } from '@angular/core';
import { Request, StatusRequest } from '../../shared/models/request.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-request-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.scss'
})
export class RequestEditComponent implements OnInit {
  requestForm: FormGroup;
  isEditMode = false;
  requestId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.requestForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.requestId = +params['id'];
        this.load(this.requestId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required],
      description: null,
      deliveredAt: [''],
      supplier: this.fb.group({
        name: ['', Validators.required],
        cnpj: ['', Validators.required]
      }),
      status: [StatusRequest.Pending, Validators.required],
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

  get itens(): FormArray {
    return this.requestForm.get('itens') as FormArray;
  }

  get supplier(): FormGroup {
    return this.requestForm.get('supplier') as FormGroup;
  }

  public addItem() {
    this.itens.push(this.createItemForm());
  }

  public removeItem(index: number) {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
      this.calculateTotal();
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
    this.requestForm.patchValue({ total });
  }

  private load(id: number) {
    const requestMock: Request = {
      id: 1,
      code: '000001',
      createdAt: new Date(),
      creator: 'João Silva',
      description: 'Pedido de teste',
      supplier: { id: 1, name: 'Fornecedor A', cnpj: '00.000.000/0001-00' },
      status: StatusRequest.Pending,
      itens: [
        { item: 'Produto A', quantity: 2, unit: 'UN', price: 100, total: 200 },
        { item: 'Produto B', quantity: 1, unit: 'UN', price: 50, total: 50 }
      ],
      total: 250
    };

    while (this.itens.length) {
      this.itens.removeAt(0);
    }

    requestMock.itens.forEach(item => {
      this.itens.push(this.fb.group(item));
    });

    this.requestForm.patchValue(requestMock);
  }

  public onSubmit() {
    if (this.requestForm.valid) {
      this.router.navigate(['/requests']);
    }
  }

  public cancel() {
    this.router.navigate(['/requests']);
  }
}
