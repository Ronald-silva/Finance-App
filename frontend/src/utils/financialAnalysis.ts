import type { Transaction } from '../types';

interface FinancialMetrics {
  income: number;
  expenses: number;
  savings: number;
  emergencyFund: number;
  debtRatio: number;
}

// Análise de tendências mensais
export function analyzeMonthlyTrends(transactions: Transaction[]) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7); // YYYY-MM
  }).reverse();

  const trends = last6Months.reduce((acc, month) => {
    const monthTransactions = transactions.filter(t => 
      t.date.startsWith(month)
    );

    acc[month] = {
      income: monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      byCategory: monthTransactions.reduce((cats, t) => {
        if (t.type === 'expense') {
          cats[t.category] = (cats[t.category] || 0) + t.amount;
        }
        return cats;
      }, {} as Record<string, number>)
    };

    return acc;
  }, {} as Record<string, any>);

  return trends;
}

// Detectar gastos incomuns
export function detectUnusualSpending(transactions: Transaction[]) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString().slice(0, 7);

  const currentMonthByCategory = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const lastMonthByCategory = transactions
    .filter(t => t.date.startsWith(lastMonth) && t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  for (const [category, amount] of Object.entries(currentMonthByCategory)) {
    const lastMonthAmount = lastMonthByCategory[category] || 0;
    if (lastMonthAmount > 0) {
      const increase = ((amount - lastMonthAmount) / lastMonthAmount) * 100;
      if (increase > 50) { // Aumento de 50% ou mais
        return {
          category,
          percentage: Math.round(increase)
        };
      }
    }
  }

  return null;
}

// Previsão de gastos para o próximo mês
export function predictNextMonthExpenses(transactions: Transaction[]) {
  const last3Months = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7);
  });

  const monthlyExpenses = last3Months.map(month => {
    return transactions
      .filter(t => t.date.startsWith(month) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const averageExpense = monthlyExpenses.reduce((a, b) => a + b, 0) / 3;
  const trend = (monthlyExpenses[0] - monthlyExpenses[2]) / 2;

  return {
    predicted: averageExpense + trend,
    trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
    confidence: calculateConfidence(monthlyExpenses)
  };
}

// Calcular pontuação de saúde financeira
export function calculateFinancialHealthScore(metrics: FinancialMetrics) {
  let score = 100;

  // Deduz pontos se gastos > 70% da renda
  const expenseRatio = metrics.expenses / metrics.income;
  if (expenseRatio > 0.7) {
    score -= (expenseRatio - 0.7) * 100;
  }

  // Deduz pontos se fundo de emergência < 6 meses
  if (metrics.emergencyFund < 6) {
    score -= (6 - metrics.emergencyFund) * 5;
  }

  // Deduz pontos se taxa de poupança < 20%
  const savingsRate = metrics.savings / metrics.income;
  if (savingsRate < 0.2) {
    score -= (0.2 - savingsRate) * 100;
  }

  // Deduz pontos por alto endividamento
  if (metrics.debtRatio > 0.3) {
    score -= (metrics.debtRatio - 0.3) * 100;
  }

  return Math.max(0, Math.min(100, score));
}

// Gerar recomendações personalizadas
export function generateSmartRecommendations({ 
  transactions, 
  trends, 
  healthScore 
}: { 
  transactions: Transaction[];
  trends: any;
  healthScore: number;
}) {
  const recommendations = [];

  // Recomendações baseadas no score de saúde financeira
  if (healthScore < 60) {
    recommendations.push({
      type: 'warning',
      title: 'Saúde Financeira em Risco',
      actions: [
        'Criar orçamento detalhado',
        'Reduzir gastos não essenciais',
        'Aumentar fundo de emergência'
      ]
    });
  }

  // Recomendações baseadas em tendências
  const lastMonth = Object.keys(trends).pop();
  if (lastMonth) {
    const { income, expenses } = trends[lastMonth];
    if (expenses > income * 0.8) {
      recommendations.push({
        type: 'danger',
        title: 'Gastos Elevados',
        actions: [
          'Revisar despesas mensais',
          'Identificar gastos desnecessários',
          'Estabelecer limites por categoria'
        ]
      });
    }
  }

  return recommendations;
}

// Funções auxiliares
function calculateConfidence(values: number[]) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Quanto menor a variação, maior a confiança
  const coefficient = standardDeviation / mean;
  return Math.max(0, Math.min(100, 100 * (1 - coefficient)));
}

export function trackFinancialGoals(transactions: Transaction[]) {
  // Implementação básica - pode ser expandida com metas reais do usuário
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavingsGoal = monthlyIncome * 0.2; // Meta de 20% de economia
  const actualSavings = monthlyIncome - transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const percentage = (actualSavings / monthlySavingsGoal) * 100;

  return {
    needsAttention: percentage < 80,
    percentage: Math.round(percentage),
    goalName: 'economia mensal'
  };
} 