import { createContext, useContext, useState, useEffect } from 'react';
import { useTransactions } from './TransactionContext';
import type { Transaction } from '../types';
import { CATEGORIES } from '../constants/categories';
import {
  analyzeMonthlyTrends,
  detectUnusualSpending,
  predictNextMonthExpenses,
  calculateFinancialHealthScore,
  generateSmartRecommendations,
  trackFinancialGoals
} from '../utils/financialAnalysis';

interface FinancialAnalysis {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  investmentAllocation: {
    stocks: number;
    crypto: number;
    savings: number;
    other: number;
  };
  trends: any;
  forecast: any;
  healthScore: number;
  recommendations: any;
}

interface FinancialAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  recommendation: string;
  date: string;
}

interface FinancialAnalysisContextType {
  analysis: FinancialAnalysis;
  alerts: FinancialAlert[];
  generateAnalysis: () => void;
}

const FinancialAnalysisContext = createContext<FinancialAnalysisContextType | undefined>(undefined);

function useFinancialAnalysisContext() {
  const context = useContext(FinancialAnalysisContext);
  if (context === undefined) {
    throw new Error('useFinancialAnalysis must be used within a FinancialAnalysisProvider');
  }
  return context;
}

export function FinancialAnalysisProvider({ children }: { children: React.ReactNode }) {
  const { transactions, balance } = useTransactions();
  const [analysis, setAnalysis] = useState<FinancialAnalysis>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    debtToIncomeRatio: 0,
    emergencyFundMonths: 0,
    investmentAllocation: {
      stocks: 0,
      crypto: 0,
      savings: 0,
      other: 0
    },
    trends: {},
    forecast: {},
    healthScore: 0,
    recommendations: {}
  });
  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);

  const calculateMonthlyMetrics = (transactions: Transaction[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.date) >= monthStart
    );

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses };
  };

  const generateAlerts = (currentAnalysis: FinancialAnalysis) => {
    const newAlerts: FinancialAlert[] = [];

    // Alerta de padrões de gastos anormais
    const unusualSpending = detectUnusualSpending(transactions);
    if (unusualSpending) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: 'warning',
        message: `Gasto incomum detectado na categoria ${unusualSpending.category}`,
        recommendation: `Seus gastos em ${unusualSpending.category} aumentaram ${unusualSpending.percentage}% em relação à média.`
      });
    }

    // Alerta de oportunidades de investimento
    if (analysis.savingsRate > 0.3) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: 'info',
        message: 'Oportunidade de investimento',
        recommendation: 'Você tem uma boa taxa de poupança. Considere diversificar seus investimentos.'
      });
    }

    // Alerta de metas financeiras
    const goalProgress = trackFinancialGoals(transactions);
    if (goalProgress.needsAttention) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: 'warning',
        message: 'Meta financeira em risco',
        recommendation: `Você está ${goalProgress.percentage}% abaixo da meta de ${goalProgress.goalName}`
      });
    }

    setAlerts(newAlerts);
  };

  const generateAnalysis = () => {
    // Análise de tendências
    const monthlyTrends = analyzeMonthlyTrends(transactions);
    
    // Previsão de gastos
    const spendingForecast = predictNextMonthExpenses(transactions);
    
    // Análise de saúde financeira
    const financialHealth = calculateFinancialHealthScore({
      income: analysis.monthlyIncome,
      expenses: analysis.monthlyExpenses,
      savings: analysis.savingsRate,
      emergencyFund: analysis.emergencyFundMonths,
      debtRatio: analysis.debtToIncomeRatio
    });

    // Recomendações personalizadas baseadas no histórico
    const recommendations = generateSmartRecommendations({
      transactions,
      trends: monthlyTrends,
      healthScore: financialHealth
    });

    const newAnalysis: FinancialAnalysis = {
      monthlyIncome: analysis.monthlyIncome,
      monthlyExpenses: analysis.monthlyExpenses,
      savingsRate: analysis.savingsRate,
      debtToIncomeRatio: analysis.debtToIncomeRatio,
      emergencyFundMonths: analysis.emergencyFundMonths,
      investmentAllocation: analysis.investmentAllocation,
      trends: monthlyTrends,
      forecast: spendingForecast,
      healthScore: financialHealth,
      recommendations
    };

    setAnalysis(newAnalysis);
    generateAlerts(newAnalysis);
  };

  useEffect(() => {
    generateAnalysis();
  }, [transactions, balance]);

  return (
    <FinancialAnalysisContext.Provider value={{ analysis, alerts, generateAnalysis }}>
      {children}
    </FinancialAnalysisContext.Provider>
  );
}

export const useFinancialAnalysis = useFinancialAnalysisContext; 