import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../../categories/models/category.model';
import { TransactionType } from '../../../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { MoneyInputDirective } from '../../../../shared/directives/money-input.directive';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, MoneyInputDirective],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent implements OnInit {
  readonly transaction = input<Transaction | null>(null);
  readonly categories = input<Category[]>([]);
  readonly submitted = output<Omit<Transaction, 'id'>>();
  readonly cancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly type = computed<TransactionType>(
    () => (this.form.controls.type.value ?? 'EXPENSE') as TransactionType,
  );

  readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['EXPENSE' as TransactionType, Validators.required],
    category: ['', Validators.required],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    const current = this.transaction();
    if (current) {
      this.form.patchValue({
        amount: current.amount,
        type: current.type,
        category: current.category,
        date: current.date.slice(0, 10),
        description: current.description ?? '',
      });
    }
  }

  setType(type: TransactionType): void {
    this.form.controls.type.setValue(type);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const raw = this.form.getRawValue();
    this.submitted.emit({
      amount: raw.amount,
      type: raw.type,
      category: raw.category,
      date: new Date(`${raw.date}T12:00:00`).toISOString(),
      description: raw.description.trim() || undefined,
    });
  }
}
