import { Component, computed, inject } from '@angular/core';
import { SummaryCardComponent } from '../../../../shared/components/summary-card/summary-card.component';
import { ExpenseChartComponent } from '../../components/expense-chart/expense-chart.component';
import { RecentActivityComponent } from '../../components/recent-activity/recent-activity.component';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [SummaryCardComponent, ExpenseChartComponent, RecentActivityComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);

  readonly transactions = this.transactionService.transactions;
  readonly categories = this.categoryService.categories;

  protected readonly income = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0),
  );

  protected readonly expense = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0),
  );

  protected readonly balance = computed(() => this.income() - this.expense());

  protected readonly balanceColor = computed(() =>
    this.balance() >= 0 ? '#2563eb' : '#ef4444',
  );
}
