import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { iconPaths } from '../../../../shared/icons';
import { Category } from '../../models/category.model';

export const CATEGORY_ICONS = [
  'food',
  'bus',
  'film',
  'home',
  'briefcase',
  'cart',
  'pill',
  'plane',
  'coffee',
  'phone',
  'trophy',
];

export const CATEGORY_COLORS = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#34d399',
  '#2dd4bf',
  '#60a5fa',
  '#a78bfa',
  '#f472b6',
  '#94a3b8',
];

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent implements OnInit {
  readonly category = input<Category | null>(null);
  readonly submitted = output<Omit<Category, 'id'>>();
  readonly cancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly icons = CATEGORY_ICONS;
  protected readonly colors = CATEGORY_COLORS;
  protected readonly iconPaths = iconPaths;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    icon: [CATEGORY_ICONS[0], Validators.required],
    color: [CATEGORY_COLORS[3], Validators.required],
    budgetLimit: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const current = this.category();
    if (current) {
      this.form.patchValue({
        name: current.name,
        icon: current.icon,
        color: current.color,
        budgetLimit: current.budgetLimit,
      });
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const raw = this.form.getRawValue();
    this.submitted.emit({
      name: raw.name.trim(),
      icon: raw.icon,
      color: raw.color,
      budgetLimit: raw.budgetLimit,
    });
  }
}