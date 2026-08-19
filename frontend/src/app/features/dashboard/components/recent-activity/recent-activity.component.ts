import { Component, computed, input } from '@angular/core';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateAgoPipe } from '../../../../shared/pipes/date-ago.pipe';
import { iconPaths } from '../../../../shared/icons';
import { Category } from '../../../categories/models/category.model';
import { Transaction } from '../../../transactions/models/transaction.model';

@Component({
  selector: 'app-recent-activity',
  imports: [CurrencyFormatPipe, DateAgoPipe],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css',
})
export class RecentActivityComponent {
  readonly transactions = input<Transaction[]>([]);
  readonly categories = input<Category[]>([]);

  protected readonly iconPaths = iconPaths;

  protected readonly recent = computed(() =>
    [...this.transactions()]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6),
  );

  categoryOf(transaction: Transaction): Category | undefined {
    return this.categories().find((c) => c.id === transaction.category);
  }
}
