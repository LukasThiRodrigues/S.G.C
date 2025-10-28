import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Supplier, SupplierStatus } from '../../shared/models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { AuthService } from '../../services/auth.service';

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
    private service: SupplierService,
    private authService: AuthService,
  ) {
    this.supplierForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const user = this.authService.getCurrentUser();

      this.authService.findOne(user.sub).subscribe(user => {
        this.supplierForm.get('creator')?.patchValue(user);
        this.supplierForm.get('creator')?.disable();
      });
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
      contactEmail: ['', [Validators.required, Validators.email]],
      creator: this.fb.group({
        id: null,
        name: ['', Validators.required]
      }),
    });
  }

  private load(id: number) {
    this.service.findOne(id).subscribe({
      next: (supplier: Supplier) => {
        this.supplierForm.patchValue(supplier);

        this.supplierForm.get('cnpj')?.disable();
        this.supplierForm.get('contactEmail')?.disable();
      }
    });
  }

  public onSubmit() {
    if (this.supplierForm.valid) {
      const formData = this.supplierForm.getRawValue();

      if (!this.isEditMode) {
        formData.status = SupplierStatus.Invited;

        this.service.create(formData).subscribe(supplier => {
          if (supplier) {
            this.router.navigate(['/suppliers']);
          }
        });
      } else {
        this.service.update(formData).subscribe(supplier => {
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
