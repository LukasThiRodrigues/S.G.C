import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Supplier, SupplierStatus } from '../../shared/models/supplier.model';

@Component({
  selector: 'app-supplier-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.scss'
})
export class SupplierEditComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.supplierForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.supplierId = +params['id'];
        this.load(this.supplierId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      cnpj: ['', Validators.required],
      name: ['', Validators.required],
      status: [SupplierStatus.Active, Validators.required]
    });
  }

  private load(id: number) {
    const supplierMock: Supplier = {
      id: 1,
      cnpj: '00.000.000/0001-00',
      name: 'Fornecedor A',
      status: SupplierStatus.Active
    };

    this.supplierForm.patchValue(supplierMock);
  }

  public onSubmit() {
    if (this.supplierForm.valid) {
      this.router.navigate(['/suppliers']);
    }
  }

  public cancel() {
    this.router.navigate(['/suppliers']);
  }
}
