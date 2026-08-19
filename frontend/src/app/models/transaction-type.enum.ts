export type TransactionType = 'EXPENSE' | 'INCOME';

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  EXPENSE: 'Gasto',
  INCOME: 'Ingreso',
};
