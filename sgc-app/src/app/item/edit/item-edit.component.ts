import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Item } from '../../shared/models/item.model';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';

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
    private route: ActivatedRoute,
    private service: ItemService,
    private authService: AuthService,
  ) {
    this.itemForm = this.createForm();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
      const user = this.authService.getCurrentUser();

      this.authService.findOne(user.sub).subscribe(user => {
        this.itemForm.get('creator')?.patchValue(user);
        this.itemForm.get('creator')?.disable();
      });

      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.load(this.itemId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: null,
      item: ['', Validators.required],
      creator: this.fb.group({
        id: null,
        name: ['', Validators.required]
      }),
      description: null,
      code: ['', Validators.required],
      unit: ['', Validators.required],
    });
  }

  private load(id: number) {
    this.service.findOne(id).subscribe({
      next: (item: Item) => {
        this.itemForm.patchValue(item);

        this.itemForm.get('code')?.disable();
        this.itemForm.get('unit')?.disable();
        this.itemForm.get('item')?.disable();
      }
    });
  }

  public onSubmit() {
    if (this.itemForm.valid) {
      if (!this.isEditMode) {
        this.service.create(this.itemForm.value).subscribe(item => {
          if (item) {
            this.router.navigate(['/items']);
          }
        });
      } else {
        this.service.update(this.itemForm.value).subscribe(item => {
          if (item) {
            this.router.navigate(['/items']);
          }
        });
      }
    }
  }

  public cancel() {
    this.router.navigate(['/items']);
  }
}
