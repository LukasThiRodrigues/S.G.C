import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { ProposalService } from '../../services/proposal.service';
import { StatusRequest } from '../../shared/models/request.model';
import { RequestService } from '../../services/request.service';
import { Proposal } from '../../shared/models/proposal.model';

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
  isSupplier: boolean = false;
  supplierId: number | null = null;
  hasProposal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private quotationService: QuotationService,
    private proposalService: ProposalService,
    private requestService: RequestService,
    private dialog: MatDialog,
  ) {
    this.quotationForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const user = this.authService.getCurrentUser();

      this.authService.findOne(user.sub).subscribe(user => {
        this.quotationForm.get('creator')?.patchValue(user);
        this.quotationForm.get('creator')?.disable();

        if (user.supplierId) {
          this.quotationForm.get('description')?.disable();
          this.isSupplier = true;
          this.supplierId = user.supplierId;
        } else {
          this.quotationForm.get('proposals')?.disable();
        }
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
      proposals: this.fb.array([this.createProposalForm()]),
      total: [0]
    });
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      itemId: null,
      unit: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.0000001)]],
      total: [0]
    });
  }

  private createSupplierForm(): FormGroup {
    return this.fb.group({
      supplier: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }

  private createProposalForm(): FormGroup {
    return this.fb.group({
      id: null,
      createdAt: new Date().toISOString().substring(0, 10),
      supplier: null,
      itens: this.fb.array([this.createItemForm()]),
      request: null,
      total: 0,
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

  get proposals(): FormArray {
    const allProposals = this.quotationForm.get('proposals') as FormArray;

    if (!this.isSupplier) {
      return allProposals;
    }

    const filtered = allProposals.controls.filter(control => {
      const proposal = control.value;
      return proposal.supplier?.id === this.supplierId;
    });

    return new FormArray(filtered);
  }


  get request(): FormArray {
    return this.proposals.get('request') as FormArray;
  }

  public getProposalItens(proposalIndex: number): FormArray {
    const proposalGroup = this.proposals.at(proposalIndex) as FormGroup;
    return proposalGroup.get('itens') as FormArray;
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
        });

        const itensFormArray = this.fb.array(
          quotation.itens.map(item => this.fb.group({
            item: item.item,
            unit: item.item.unit,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        );
        this.quotationForm.setControl('itens', itensFormArray);

        const suppliersFormArray = this.fb.array(
          quotation.suppliers.map(supplier => this.fb.group({
            supplier: supplier.supplier,
            cnpj: supplier.supplier.cnpj
          }))
        );
        this.quotationForm.setControl('suppliers', suppliersFormArray);

        const proposalsFormArray = this.fb.array(
          quotation.proposals.map(proposal => {
            const proposalItensFA = this.fb.array(
              proposal.itens.map(proposalItem => this.fb.group({
                item: proposalItem.item.item,
                itemId: proposalItem.item.id,
                unit: proposalItem.item?.unit,
                quantity: proposalItem.quantity,
                price: proposalItem.price,
                total: proposalItem.total
              }))
            );

            return this.fb.group({
              id: proposal.id,
              createdAt: new Date(proposal.createdAt).toISOString().substring(0, 10),
              supplier: proposal.supplier,
              itens: proposalItensFA,
              request: proposal.request,
              total: proposal.total
            });
          })
        );
        this.quotationForm.setControl('proposals', proposalsFormArray);

        this.hasProposal = quotation.proposals && quotation.proposals.length > 0;

        if (this.hasProposal) {
          this.quotationForm.get('description')?.disable();
        }

        this.quotationForm.get('createdAt')?.disable();
        this.quotationForm.get('code')?.disable();
        this.quotationForm.get('itens')?.disable();
        this.quotationForm.get('suppliers')?.disable();
        this.quotationForm.get('proposals')?.disable();

        if (this.isSupplier) {
          const itensFormArray = this.quotationForm.get('itens') as FormArray;
          itensFormArray.controls.forEach(control => {
            control.get('quantity')?.enable();
            control.get('price')?.enable();
          });
        }

        if (quotation.proposals.length > 0) {
          for (const proposal of quotation.proposals) {
            const isSupplierLogged = proposal.supplier.id === this.supplierId;

            if (this.isSupplier && isSupplierLogged) {
              const itensFormArray = this.quotationForm.get('itens') as FormArray;
              itensFormArray.controls.forEach(control => {
                control.get('quantity')?.disable();
                control.get('price')?.disable();
              });
            }
          }
        }
      }
    });
  }

  public onSubmit() {
    let formData = this.quotationForm.getRawValue();

    if (!this.isEditMode && !this.isSupplier) {
      formData.proposals = null;
    }

    if (this.quotationForm.valid) {
      if (this.isSupplier) {
        formData.quotationId = this.quotationId;
        formData.supplierId = this.supplierId;

        this.proposalService.create(formData).subscribe(proposal => {
          if (proposal) {
            formData.proposals.push(proposal);

            if (formData.proposals.length >= 2) {
              const quotation = this.quotationForm.getRawValue();
              quotation.id = this.quotationId;
              quotation.status = StatusQuotation.InDecision;

              this.quotationService.update(quotation).subscribe(quotation => {
                if (quotation) {
                  this.router.navigate(['/quotations']);
                }
              });
            }

            this.router.navigate(['/quotations']);
          }
        });
      } else {
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
  }

  public cancel() {
    this.router.navigate(['/quotations']);
  }

  public searchSupplier(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTextSupplier = filterValue;

    this.supplierService.findAll(this.page, this.limit, this.searchTextSupplier).subscribe({
      next: (res: any) => {
        this.allSuppliers = res.suppliers.filter((supplier: Supplier) => ![SupplierStatus.Invited, SupplierStatus.Inactive].includes(supplier.status));
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

  public generateRequest(index: number) {
    const proposal = this.proposals.at(index).value;
    const user = this.authService.getCurrentUser();

    this.authService.findOne(user.sub).subscribe(user => {
      const requestForm = {
        code: '',
        createdAt: new Date(),
        creator: user,
        description: '',
        reason: null,
        supplier: proposal.supplier,
        status: StatusRequest.Draft,
        itens: proposal.itens,
        total: proposal.total,
        quotationId: this.quotationId,
        proposalId: proposal.id
      }

      this.requestService.create(requestForm).subscribe(request => {
        if (request) {
          const quotation = this.quotationForm.getRawValue();
          quotation.id = this.quotationId;
          quotation.status = StatusQuotation.GeneratedRequest;

          this.quotationService.update(quotation).subscribe(quotation => {
            if (quotation) {
              this.router.navigate(['/request/edit/', request.id]);
            }
          });
        }
      });
    });
  }

  public hasRequest(): boolean {
    return this.proposals.value.some((proposal: Proposal) => !!proposal.request?.id);
  }

  public proposalHasRequest(index: number): boolean {
    const proposal = this.proposals.at(index).value;

    return proposal.request?.id ? true : false;
  }

  public hasSupplierSentProposal(): boolean {
    const proposals = this.quotationForm.get('proposals')?.value || [];

    if (!this.isSupplier || proposals.length === 0) {
      return false;
    }

    return proposals.some((proposal: Proposal) => proposal.supplier?.id === this.supplierId);
  }

}
