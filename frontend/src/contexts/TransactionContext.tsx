import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction } from '../types';
import { transactionService } from '../services/api';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Renomeie para useTransactionsContext para evitar conflitos
function useTransactionsContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações
  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (err) {
        setError('Erro ao carregar transações');
        // Fallback para localStorage
        const saved = localStorage.getItem('transactions');
        if (saved) setTransactions(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  // Backup no localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'income' 
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const transaction = await transactionService.create(newTransaction);
      setTransactions(prev => [...prev, transaction]);
    } catch (err) {
      setError('Erro ao adicionar transação');
      // Fallback local
      const transaction: Transaction = {
        ...newTransaction,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      setTransactions(prev => [...prev, transaction]);
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Erro ao remover transação');
      // Remove localmente mesmo com erro
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        removeTransaction,
        balance,
        isLoading,
        error 
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// Exporte o hook separadamente
export const useTransactions = useTransactionsContext; 