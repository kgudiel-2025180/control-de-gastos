import { Component, computed, input } from '@angular/core';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { iconPaths } from '../../../../shared/icons';
import { Category } from '../../../categories/models/category.model';
import { Transaction } from '../../../transactions/models/transaction.model';

export interface ChartSlice {
  category: Category | undefined;
  amount: number;
  percent: number;
}

@Component({
  selector: 'app-expense-chart',
  imports: [CurrencyFormatPipe],
  templateUrl: './expense-chart.component.html',
  styleUrl: './expense-chart.component.css',
})
export class ExpenseChartComponent {
  readonly transactions = input<Transaction[]>([]);
  readonly categories = input<Category[]>([]);

  protected readonly iconPaths = iconPaths;

  protected readonly slices = computed<ChartSlice[]>(() => {
    const expenses = this.transactions().filter((t) => t.type === 'EXPENSE');
    const byCategory = new Map<string, number>();
    for (const transaction of expenses) {
      byCategory.set(
        transaction.category,
        (byCategory.get(transaction.category) ?? 0) + transaction.amount,
      );
    }
    const total = [...byCategory.values()].reduce((sum, v) => sum + v, 0);
    if (total <= 0) {
      return [];
    }
    return [...byCategory.entries()]
      .map(([categoryId, amount]) => ({
        category: this.categories().find((c) => c.id === categoryId),
        amount,
        percent: Math.round((amount / total) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);
  });

  protected readonly totalExpenses = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0),
  );

  protected readonly donutGradient = computed(() => {
    const slices = this.slices();
    const total = slices.reduce((sum, s) => sum + s.amount, 0);
    if (total <= 0) {
      return '';
    }
    let acc = 0;
    return slices
      .map((slice) => {
        const start = (acc / total) * 360;
        acc += slice.amount;
        const end = (acc / total) * 360;
        const color = slice.category?.color ?? '#94a3b8';
        return `${color} ${start}deg ${end}deg`;
      })
      .join(', ');
  });
}
