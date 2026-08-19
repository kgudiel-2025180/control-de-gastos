import { Component, computed, input, output } from '@angular/core';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { iconPaths } from '../../../../shared/icons';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-card',
  imports: [CurrencyFormatPipe],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly spent = input(0);
  readonly edit = output<Category>();
  readonly delete = output<Category>();

  protected readonly iconPaths = iconPaths;

  protected readonly percent = computed(() => {
    const limit = this.category().budgetLimit;
    if (limit <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.spent() / limit) * 100));
  });

  protected readonly overBudget = computed(
    () => this.category().budgetLimit > 0 && this.spent() > this.category().budgetLimit,
  );
}