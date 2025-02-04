import { useTransactions } from '../../contexts/TransactionContext';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  PlusIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { TransactionItem } from './TransactionItem';
import { FinancialInsights } from './FinancialInsights';

interface DashboardProps {
  onNewTransaction: () => void;
}

export function Dashboard({ onNewTransaction }: DashboardProps) {
  const { transactions, balance, removeTransaction, isLoading, error } = useTransactions();

  const calculateIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const calculateExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando suas transações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button 
            className="mt-4 button-primary"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-500">Gerencie suas finanças de forma simples e eficiente</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Saldo Card */}
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-100">Saldo Total</p>
                <h2 className="text-3xl font-bold text-white mt-2">
                  R$ {balance.toFixed(2)}
                </h2>
              </div>
              <BanknotesIcon className="w-8 h-8 text-primary-100" />
            </div>
          </div>

          {/* Ganhos Card */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500">Ganhos</p>
                <h3 className="text-2xl font-semibold text-green-600 mt-2">
                  R$ {calculateIncome().toFixed(2)}
                </h3>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Gastos Card */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500">Gastos</p>
                <h3 className="text-2xl font-semibold text-red-600 mt-2">
                  R$ {calculateExpenses().toFixed(2)}
                </h3>
              </div>
              <ArrowTrendingDownIcon className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button 
            className="button-primary flex items-center gap-2"
            onClick={onNewTransaction}
          >
            <PlusIcon className="w-5 h-5" />
            Nova Transação
          </button>
          <button className="button-secondary flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            Ver Relatórios
          </button>
        </div>

        {/* Novo componente de Insights */}
        <div className="mb-8">
          <FinancialInsights />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Transações Recentes
            </h3>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Ver todas
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma transação registrada</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onDelete={removeTransaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 