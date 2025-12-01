import { useState, useEffect } from 'react'
import { financeService } from './services/financeService'
import JournalEntryForm from './components/JournalEntryForm'
import GeneralJournal from './components/GeneralJournal'
import LedgerDashboard from './components/LedgerDashboard'
import TAccountView from './components/TAccountView'
import TrialBalance from './components/TrialBalance'
import IncomeStatement from './components/IncomeStatement'
import BalanceSheet from './components/BalanceSheet'

import HomeDashboard from './components/HomeDashboard'

function App() {
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard', 'journal', 'ledger', 'reports'
  const [activeReport, setActiveReport] = useState('trial-balance') // 'trial-balance', 'income-statement', 'balance-sheet'
  const [selectedAccount, setSelectedAccount] = useState(null)



  // Data State
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  // Initial Data Fetching
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        // Seed accounts if needed
        await financeService.seedAccounts()

        // Fetch data
        const [fetchedAccounts, fetchedTransactions] = await Promise.all([
          financeService.fetchAccounts(),
          financeService.fetchTransactions()
        ])

        setAccounts(fetchedAccounts)
        setTransactions(fetchedTransactions)
      } catch (err) {
        console.error('Failed to initialize data:', err)
        setError('Failed to load financial data. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const handlePostEntry = async (entry) => {
    try {
      // Optimistic update or re-fetch? Re-fetch is safer for consistency
      await financeService.addTransaction(entry)
      const updatedTransactions = await financeService.fetchTransactions()
      setTransactions(updatedTransactions)
      return true // Success
    } catch (err) {
      console.error('Failed to post entry:', err)
      alert(err.message) // Simple alert for now, component handles toast
      return false
    }
  }

  const handleAccountClick = (account) => {
    setSelectedAccount(account)
  }

  const handleCloseTAccount = () => {
    setSelectedAccount(null)
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-primary-600 font-medium">Loading Financial Data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-primary-100">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-primary-900 mb-2">Error Loading Data</h2>
          <p className="text-primary-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 font-sans text-primary-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-primary-100 sticky top-0 z-20 transition-all duration-300 shadow-sm shadow-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer" onClick={() => setActiveView('dashboard')}>
                <div className="w-12 h-12 bg-gradient-to-tr from-accent-400 to-accent-300 rounded-2xl shadow-lg shadow-accent-200 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out ring-4 ring-white">
                  <span className="text-white font-black text-2xl tracking-tighter">L</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tight text-primary-800 leading-none group-hover:text-accent-500 transition-colors">
                    Office Ledger
                  </span>
                  <span className="text-[10px] font-bold text-accent-400 tracking-widest uppercase mt-1 bg-accent-50 px-2 py-0.5 rounded-full w-fit group-hover:bg-accent-100 transition-colors">Pro Finance</span>
                </div>
              </div>

              <div className="hidden md:flex ml-6">
                <nav className="flex space-x-2 bg-primary-50/80 p-1.5 rounded-full border border-primary-100/50">
                  {['dashboard', 'journal', 'ledger', 'reports'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out ${activeView === view
                        ? 'bg-white text-accent-500 shadow-md shadow-accent-100/50 scale-105 ring-2 ring-accent-100'
                        : 'text-primary-400 hover:text-primary-600 hover:bg-white/60 hover:shadow-sm'
                        }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-success-50 text-success-600 rounded-full text-xs font-bold border border-success-100 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse"></span>
                Double Entry Active
              </div>



              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-black text-sm ring-4 ring-white shadow-lg shadow-primary-100 hover:scale-110 transition-transform cursor-pointer">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <HomeDashboard
            accounts={accounts}
            transactions={transactions}
            loading={loading}
          />
        )}

        {activeView === 'journal' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Transaction</h2>
                <span className="text-sm text-gray-500">Record daily financial activities</span>
              </div>
              <JournalEntryForm onPostEntry={handlePostEntry} accounts={accounts} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">General Journal</h2>
                <span className="text-sm text-gray-500">Chronological record of all entries</span>
              </div>
              <GeneralJournal transactions={transactions} />
            </section>
          </div>
        )}

        {activeView === 'ledger' && (
          <div className="animate-in fade-in duration-500">
            {selectedAccount ? (
              <TAccountView
                account={selectedAccount}
                transactions={transactions}
                onClose={handleCloseTAccount}
              />
            ) : (
              <LedgerDashboard
                onAccountClick={handleAccountClick}
                transactions={transactions}
                accounts={accounts}
              />
            )}
          </div>
        )}

        {activeView === 'reports' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                <button
                  onClick={() => setActiveReport('trial-balance')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeReport === 'trial-balance'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Trial Balance
                </button>
                <button
                  onClick={() => setActiveReport('income-statement')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeReport === 'income-statement'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Income Statement
                </button>
                <button
                  onClick={() => setActiveReport('balance-sheet')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeReport === 'balance-sheet'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Balance Sheet
                </button>
              </div>
            </div>

            {activeReport === 'trial-balance' && <TrialBalance transactions={transactions} accounts={accounts} />}
            {activeReport === 'income-statement' && <IncomeStatement transactions={transactions} accounts={accounts} />}
            {activeReport === 'balance-sheet' && <BalanceSheet transactions={transactions} accounts={accounts} />}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
