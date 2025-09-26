import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Supplier, SupplierStatus } from '../../shared/models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

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
    private route: ActivatedRoute,
    private service: SupplierService
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
      status: [SupplierStatus.Inactive, Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  private load(id: number) {
    this.service.findOne(id).subscribe({
      next: (supplier: Supplier) => {
        this.supplierForm.patchValue(supplier);
      }
    });
  }

  public onSubmit() {
    if (this.supplierForm.valid) {
      if (!this.isEditMode) {
        this.supplierForm.get('status')?.setValue(SupplierStatus.Invited);
        this.service.create(this.supplierForm.value).subscribe(supplier => {
          if (supplier) {
            this.router.navigate(['/suppliers']);
          }
        });
      } else {
        this.service.update(this.supplierForm.value).subscribe(supplier => {
          if (supplier) {
            this.router.navigate(['/suppliers']);
          }
        });
      }
    }
  }

  public cancel() {
    this.router.navigate(['/suppliers']);
  }
}
