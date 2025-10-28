import { Component, OnInit } from '@angular/core';
import { Request, StatusRequest } from '../../shared/models/request.model';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Supplier } from '../../shared/models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Item } from '../../shared/models/item.model';
import { ItemService } from '../../services/item.service';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RejectReasonDialogComponent } from '../../shared/components/reason/reason.component';

@Component({
  selector: 'app-request-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, MatAutocompleteModule],
  standalone: true,
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.scss'
})
export class RequestEditComponent implements OnInit {
  requestForm: FormGroup;
  isEditMode = false;
  requestId?: number;
  searchTextSupplier: string = '';
  searchTextItem: string = '';
  page: number = 1;
  limit: number = 10;
  allSuppliers: Supplier[] = [];
  allItens: Item[] = [];
  supplierControl;
  isSupplier: boolean = false;
  hasQuotation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private supplierService: SupplierService,
    private itemService: ItemService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.requestForm = this.createForm();
    this.supplierControl = new FormControl<Supplier | null>(null, Validators.required);
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const user = this.authService.getCurrentUser();

      this.authService.findOne(user.sub).subscribe(user => {
        this.requestForm.get('creator')?.patchValue(user);
        this.requestForm.get('creator')?.disable();

        if (user.supplierId) {
          this.requestForm.get('description')?.disable();
          this.isSupplier = true;
        }
      });

      if (params['id']) {
        this.isEditMode = true;
        this.requestId = +params['id'];
        this.load(this.requestId);
      } else {
        this.requestForm.get('createdAt')?.disable();
        this.requestForm.get('deliveredAt')?.disable();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      createdAt: [new Date().toISOString().substring(0, 10), Validators.required],
      description: null,
      deliveredAt: [''],
      reason: null,
      supplier: this.fb.group({
        id: null,
        name: ['', Validators.required],
        cnpj: ['', Validators.required]
      }),
      creator: this.fb.group({
        id: null,
        name: ['', Validators.required]
      }),
      status: null,
      itens: this.fb.array([this.createItemForm()]),
      quotation: this.fb.group({
        id: null,
        code: ''
      }),
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

  get creator(): FormGroup {
    return this.requestForm.get('creator') as FormGroup;
  }

  get quotation(): FormGroup {
    return this.requestForm.get('quotation') as FormGroup;
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
    this.requestService.findOne(id).subscribe({
      next: (request: Request) => {
        this.requestForm.patchValue({
          ...request,
          createdAt: new Date(request.createdAt).toISOString().substring(0, 10),
          deliveredAt: request.deliveredAt ? new Date(request.deliveredAt).toISOString().substring(0, 10) : null,
          supplier: {
            id: request.supplier?.id ?? null,
            name: request.supplier?.name ?? '',
            cnpj: request.supplier?.cnpj ?? ''
          }
        });

        const supplier = request.supplier;
        if (supplier && !this.allSuppliers.find(s => s.id === supplier.id)) {
          this.allSuppliers.push(supplier);
        }

        if (request.supplier) {
          this.supplierControl.setValue(request.supplier);
        }

        const itensFormArray = this.fb.array(
          request.itens.map(item => this.fb.group({
            item: item.item,
            unit: item.item.unit,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        );
        this.requestForm.setControl('itens', itensFormArray);

        this.requestForm.get('createdAt')?.disable();
        this.requestForm.get('deliveredAt')?.disable();
        this.requestForm.get('code')?.disable();
        this.requestForm.get('itens')?.disable();
        this.requestForm.get('reason')?.disable();
        this.supplierControl.disable();

        if (this.requestForm.get('status')?.value === StatusRequest.Draft) {
          this.requestForm.get('code')?.enable();
        }

        if (request.quotationId) {
          this.requestForm.get('quotation')?.disable();
          this.hasQuotation = true;
        }

        if (!this.canEdit()) {
          this.requestForm.get('description')?.disable();
        }
      }
    });
  }

  public onSubmit() {
    if (this.requestForm.valid) {
      const formData = this.requestForm.getRawValue();

      if (!this.isEditMode) {
        formData.status = StatusRequest.Pending;

        this.requestService.create(formData).subscribe(request => {
          if (request) {
            this.router.navigate(['/requests']);
          }
        });
      } else {
        formData.id = this.requestId;

        if (this.isSupplier) {
          formData.status = StatusRequest.SupplierAccepted
        }

        if (formData.status === StatusRequest.Draft) {
          formData.status = StatusRequest.Pending
        }

        this.requestService.update(formData).subscribe(request => {
          if (request) {
            this.router.navigate(['/requests']);
          }
        });
      }
    }
  }

  public cancel() {
    if (this.canRefuse()) {
      const dialogRef = this.dialog.open(RejectReasonDialogComponent, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(reason => {
        if (reason) {
          const formData = this.requestForm.getRawValue();
          formData.id = this.requestId;
          formData.status = StatusRequest.SupplierRejected;
          formData.reason = reason
          this.requestService.update(formData).subscribe({
            next: () => {
              this.router.navigate(['/requests']);
            },
            error: err => console.error('Erro ao recusar pedido', err)
          });
        }
      });
    } else {
      this.router.navigate(['/requests']);
    }
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

  public onSupplierSelected(selectedSupplier: Supplier) {
    this.requestForm.get('supplier')?.patchValue(selectedSupplier);
    this.supplierControl.setValue(selectedSupplier);
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

  public canRefuse(): boolean {
    return this.isSupplier && this.requestForm.get('status')?.value == StatusRequest.Pending;
  }

  public canEdit(): boolean {
    return [StatusRequest.Draft, StatusRequest.Pending].includes(this.requestForm.get('status')?.value);
  }
}
