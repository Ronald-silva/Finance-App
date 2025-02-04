import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import { TrashIcon } from '@heroicons/react/24/outline';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long'
    }).format(new Date(date));
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{CATEGORIES[transaction.category as keyof typeof CATEGORIES]}</span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
          {transaction.installments && (
            <p className="text-sm text-gray-500 mt-1">
              Parcela {transaction.installments.current} de {transaction.installments.total} - 
              R$ {transaction.installments.amount.toFixed(2)}/
              {transaction.installments.frequency === 'monthly' ? 'mês' : 'semana'}
            </p>
          )}
        </div>
        <div className={`text-right ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          <p className="font-medium">
            {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 