import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Item } from '../../shared/models/item.model';

@Component({
  selector: 'app-item-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.scss'
})
export class ItemEditComponent implements OnInit {
  itemForm: FormGroup;
  isEditMode = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.load(this.itemId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      code: ['', Validators.required],
      unit: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  private load(id: number) {
    const itemMock: Item = {
      id: 1,
      item: 'Item A',
      code: 'A001',
      unit: 'UN',
      quantity: 10,
      price: 15.5,
      total: 155
    };

    this.itemForm.patchValue(itemMock);
  }

  public onSubmit() {
    if (this.itemForm.valid) {
      this.router.navigate(['/items']);
    }
  }

  public cancel() {
    this.router.navigate(['/items']);
  }
}
