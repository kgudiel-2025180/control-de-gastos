import { TransactionType } from '../../../models/transaction-type.enum';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}
