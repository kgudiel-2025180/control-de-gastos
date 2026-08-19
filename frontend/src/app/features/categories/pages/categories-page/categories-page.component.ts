import { Component, computed, inject, signal } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../../transactions/services/transaction.service';

@Component({
  selector: 'app-categories-page',
  imports: [
    ModalComponent,
    ConfirmDialogComponent,
    CategoryCardComponent,
    CategoryFormComponent,
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
})
export class CategoriesPageComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly transactionService = inject(TransactionService);

  readonly categories = this.categoryService.categories;

  protected readonly formOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly pendingDelete = signal<Category | null>(null);

  protected readonly editingCategory = computed(() => {
    const id = this.editingId();
    return id ? this.categoryService.getById(id) ?? null : null;
  });

  protected readonly spentByCategory = computed(() => {
    const spent = new Map<string, number>();
    for (const transaction of this.transactionService.transactions()) {
      if (transaction.type !== 'EXPENSE') {
        continue;
      }
      spent.set(
        transaction.category,
        (spent.get(transaction.category) ?? 0) + transaction.amount,
      );
    }
    return spent;
  });

  onOpenCreate(): void {
    this.editingId.set(null);
    this.formOpen.set(true);
  }

  onOpenEdit(category: Category): void {
    this.editingId.set(category.id);
    this.formOpen.set(true);
  }

  onCloseForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  onSubmitted(data: Omit<Category, 'id'>): void {
    const id = this.editingId();
    if (id) {
      this.categoryService.update(id, data);
    } else {
      this.categoryService.add(data);
    }
    this.onCloseForm();
  }

  onAskDelete(category: Category): void {
    this.pendingDelete.set(category);
  }

  onDeleteConfirmed(): void {
    const pending = this.pendingDelete();
    if (pending) {
      this.categoryService.remove(pending.id);
    }
    this.pendingDelete.set(null);
  }

  onDeleteCancelled(): void {
    this.pendingDelete.set(null);
  }
}
