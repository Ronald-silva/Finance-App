import { useState } from 'react'
import { Dashboard } from './components/Dashboard/Dashboard'
import { TransactionForm } from './components/TransactionForm/TransactionForm'
import { TransactionProvider } from './contexts/TransactionContext'
import { FinancialAnalysisProvider } from './contexts/FinancialAnalysisContext'
import './styles/global.css'

function App() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)

  return (
    <TransactionProvider>
      <FinancialAnalysisProvider>
        <Dashboard onNewTransaction={() => setIsTransactionFormOpen(true)} />
        {isTransactionFormOpen && (
          <TransactionForm onClose={() => setIsTransactionFormOpen(false)} />
        )}
      </FinancialAnalysisProvider>
    </TransactionProvider>
  )
}

export default App
