import { useFinancialAnalysis } from '../../contexts/FinancialAnalysisContext';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export function FinancialInsights() {
  const { analysis, alerts } = useFinancialAnalysis();

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'danger':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-medium text-gray-700">Taxa de Poupança</h3>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatPercent(analysis.savingsRate)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-medium text-gray-700">Fundo de Emergência</h3>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {analysis.emergencyFundMonths.toFixed(1)} meses
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-medium text-gray-700">Gastos por Categoria</h3>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {analysis.monthlyExpenses.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-medium text-gray-700">Alocação em Cripto</h3>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatPercent(analysis.investmentAllocation.crypto)}
          </p>
        </div>

        {/* Adicione mais métricas aqui */}
      </div>

      {/* Alertas e Recomendações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas e Recomendações
        </h3>
        
        <div className="space-y-3">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.type === 'danger' 
                  ? 'bg-red-50 border-red-200' 
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : alert.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div>
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 