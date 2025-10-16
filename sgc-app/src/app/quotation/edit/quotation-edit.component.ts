import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Quotation, StatusQuotation } from '../../shared/models/quotation.model';
import { Supplier, SupplierStatus } from '../../shared/models/supplier.model';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../shared/models/item.model';
import { ItemService } from '../../services/item.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SupplierService } from '../../services/supplier.service';
import { QuotationService } from '../../services/quotation.service';

@Component({
  selector: 'app-quotation-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, MatAutocompleteModule],
  standalone: true,
  templateUrl: './quotation-edit.component.html',
  styleUrl: './quotation-edit.component.scss'
})
export class QuotationEditComponent implements OnInit {
  quotationForm: FormGroup;
  isEditMode = false;
  quotationId?: number;
  searchTextSupplier: string = '';
  searchTextItem: string = '';
  page: number = 1;
  limit: number = 10;
  allSuppliers: Supplier[] = [];
  allItens: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private quotationService: QuotationService
  ) {
    this.quotationForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const user = this.authService.getCurrentUser();

      this.authService.findOne(user.sub).subscribe(user => {
        this.quotationForm.get('creator')?.patchValue(user);
        this.quotationForm.get('creator')?.disable();
      });

      if (params['id']) {
        this.isEditMode = true;
        this.quotationId = +params['id'];
        this.load(this.quotationId);
      } else {
        this.quotationForm.get('createdAt')?.disable();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required],
      description: ['', Validators.required],
      creator: this.fb.group({
        id: null,
        name: ['', Validators.required]
      }),
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
      supplier: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }

  get itens(): FormArray {
    return this.quotationForm.get('itens') as FormArray;
  }

  get suppliers(): FormArray {
    return this.quotationForm.get('suppliers') as FormArray;
  }

  get creator(): FormGroup {
    return this.quotationForm.get('creator') as FormGroup;
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
    this.quotationService.findOne(id).subscribe({
      next: (quotation: Quotation) => {
        this.quotationForm.patchValue({
          ...quotation,
          createdAt: new Date(quotation.createdAt).toISOString().substring(0, 10),
          suppliers: quotation.suppliers,
        });

        const itensFormArray = this.fb.array(
          quotation.itens.map(item => this.fb.group({
            item: item.item,
            unit: item.unit,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        );
        this.quotationForm.setControl('itens', itensFormArray);

        this.quotationForm.get('createdAt')?.disable();
        this.quotationForm.get('code')?.disable();
        this.quotationForm.get('itens')?.disable();
        this.quotationForm.get('suppliers')?.disable();
      }
    });
  }

  public onSubmit() {
    if (this.quotationForm.valid) {
      const formData = this.quotationForm.getRawValue();

      if (!this.isEditMode) {
        formData.status = StatusQuotation.Pending;

        this.quotationService.create(formData).subscribe(quotation => {
          if (quotation) {
            this.router.navigate(['/quotations']);
          }
        });
      } else {
        formData.id = this.quotationId;

        this.quotationService.update(formData).subscribe(quotation => {
          if (quotation) {
            this.router.navigate(['/quotations']);
          }
        });
      }
    }
  }

  public cancel() {
    this.router.navigate(['/quotations']);
  }

  public searchSupplier(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTextSupplier = filterValue;

    this.supplierService.findAll(this.page, this.limit, this.searchTextSupplier).subscribe({
      next: (res: any) => {
        this.allSuppliers = res.suppliers;
      }
    });
  }

  displaySupplierFn(supplier?: Supplier): string {
    return supplier ? supplier.name : '';
  }

  public onSupplierSelected(index: number, selectedSupplier: Supplier) {
    const supplierGroup = this.suppliers.at(index);
    supplierGroup.patchValue({
      supplier: selectedSupplier,
      cnpj: selectedSupplier.cnpj
    });

    supplierGroup.get('cnpj')?.disable();
  }

  public searchItem(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTextItem = filterValue;

    this.itemService.findAll(this.page, this.limit, this.searchTextItem).subscribe({
      next: (res: any) => {
        this.allItens = res.items;
      }
    });
  }

  displayItemFn(item?: Item): string {
    return item ? item.item : '';
  }

  public onItemSelected(index: number, selectedItem: Item) {
    const itemGroup = this.itens.at(index);
    itemGroup.patchValue({
      item: selectedItem,
      unit: selectedItem.unit
    });

    itemGroup.get('unit')?.disable();

    this.calculateTotalItem(index);
  }
}
