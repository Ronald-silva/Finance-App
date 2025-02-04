export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: string;
  installments?: {
    total: number;
    current: number;
    amount: number;
    frequency: 'monthly' | 'weekly';
    startDate: string;
    endDate: string;
  };
  isRecurring?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
} 