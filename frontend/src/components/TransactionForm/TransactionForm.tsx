import { useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { CATEGORIES } from '../../constants/categories';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TransactionFormProps {
  onClose: () => void;
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    hasInstallments: false,
    installments: {
      total: 1,
      amount: '',
      frequency: 'monthly' as 'monthly' | 'weekly'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const totalAmount = Number(formData.amount);
      const installmentAmount = formData.hasInstallments 
        ? Number(formData.installments.amount)
        : totalAmount;

      const startDate = new Date();
      const endDate = new Date();
      if (formData.hasInstallments) {
        if (formData.installments.frequency === 'monthly') {
          endDate.setMonth(endDate.getMonth() + formData.installments.total - 1);
        } else {
          endDate.setDate(endDate.getDate() + (formData.installments.total - 1) * 7);
        }
      }

      console.log('Enviando transação:', {
        amount: totalAmount,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        ...(formData.hasInstallments && {
          installments: {
            total: formData.installments.total,
            current: 1,
            amount: installmentAmount,
            frequency: formData.installments.frequency,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        })
      });

      await addTransaction({
        amount: totalAmount,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        ...(formData.hasInstallments && {
          installments: {
            total: formData.installments.total,
            current: 1,
            amount: installmentAmount,
            frequency: formData.installments.frequency,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        })
      });

      onClose();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-900">Nova Transação</h2>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Valor e Descrição */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="number"
                id="amount"
                className="input-field"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                className="input-field"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${formData.type === 'expense' 
                    ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFormData({...formData, type: 'expense'})}
              >
                Gasto
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${formData.type === 'income' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFormData({...formData, type: 'income'})}
              >
                Ganho
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              className="input-field"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Selecione uma categoria</option>
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          {/* Parcelamento */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="hasInstallments"
                checked={formData.hasInstallments}
                onChange={e => setFormData({...formData, hasInstallments: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="hasInstallments" className="text-sm font-medium text-gray-700">
                Parcelado
              </label>
            </div>

            {formData.hasInstallments && (
              <div className="space-y-4 pl-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Parcelas
                    </label>
                    <input
                      type="number"
                      id="installments"
                      min="2"
                      max="48"
                      className="input-field"
                      value={formData.installments.total}
                      onChange={e => {
                        const total = Number(e.target.value);
                        const amount = (Number(formData.amount) / total).toFixed(2);
                        setFormData({
                          ...formData,
                          installments: {
                            ...formData.installments,
                            total,
                            amount
                          }
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Frequência
                    </label>
                    <select
                      id="frequency"
                      className="input-field"
                      value={formData.installments.frequency}
                      onChange={e => setFormData({
                        ...formData,
                        installments: {
                          ...formData.installments,
                          frequency: e.target.value as 'monthly' | 'weekly'
                        }
                      })}
                    >
                      <option value="monthly">Mensal</option>
                      <option value="weekly">Semanal</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Valor por parcela: <span className="font-medium">R$ {(Number(formData.amount) / formData.installments.total).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6">
            <div className="flex gap-4">
              <button
                type="button"
                className="button-secondary flex-1"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="button-primary flex-1">
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 