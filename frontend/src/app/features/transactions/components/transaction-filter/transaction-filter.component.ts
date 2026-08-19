import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TransactionType } from '../../../../models/transaction-type.enum';
import { Category } from '../../../categories/models/category.model';

export interface TransactionFilterCriteria {
  type: TransactionType | 'ALL';
  categoryId: string;
  from: string;
  to: string;
}

export const EMPTY_CRITERIA: TransactionFilterCriteria = {
  type: 'ALL',
  categoryId: '',
  from: '',
  to: '',
};

@Component({
  selector: 'app-transaction-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css',
})
export class TransactionFilterComponent implements OnInit {
  readonly categories = input<Category[]>([]);
  readonly criteriaChange = output<TransactionFilterCriteria>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    type: ['ALL' as TransactionType | 'ALL'],
    categoryId: [''],
    from: [''],
    to: [''],
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.criteriaChange.emit(this.form.getRawValue() as TransactionFilterCriteria);
    });
  }

  onClear(): void {
    this.form.reset(EMPTY_CRITERIA);
  }
}
