'use client'

import { useState, useEffect } from 'react'
import AudioRecorder from './components/AudioRecorder'
import FinancialDashboard from './components/FinancialDashboard'
import { Mic, BarChart3, MessageCircle, TrendingUp, ArrowLeftRight } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat')
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Carregar transações salvas do localStorage
    const savedTransactions = localStorage.getItem('financialTransactions')
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions)
      // Ordenar por data (mais recente primeiro)
      const sortedTransactions = parsedTransactions.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setTransactions(sortedTransactions)
    }
  }, [])

  const handleNewTransaction = (transaction: any) => {
    const newTransactions = [...transactions, { ...transaction, id: Date.now(), date: new Date().toISOString() }]
    // Ordenar por data (mais recente primeiro)
    const sortedTransactions = newTransactions.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setTransactions(sortedTransactions)
    localStorage.setItem('financialTransactions', JSON.stringify(sortedTransactions))
  }

  const toggleScreen = () => {
    setActiveTab(activeTab === 'chat' ? 'dashboard' : 'chat')
  }

  return (
    <div>
      {/* Chat Container */}
      <div className="chat-container">
        {/* Header */}
                 <div className="chat-header">
           <div className="flex items-center justify-center space-x-2">
             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
               <TrendingUp size={18} className="text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-white drop-shadow-sm">Financeiro AI</h1>
               <p className="text-sm text-white opacity-95 font-medium">Assistente Financeiro</p>
             </div>
           </div>
         </div>

        {/* Navigation */}
                 <div className="bg-white border-b-2 border-transparent" style={{
           backgroundImage: 'linear-gradient(to right, white, #eff6ff, #e0e7ff), linear-gradient(to right, #6366f1, #8b5cf6, #a855f7)',
           backgroundOrigin: 'border-box',
           backgroundClip: 'padding-box, border-box'
         }}>
          <div className="flex">
                                                     <button
                       onClick={() => setActiveTab('chat')}
                       className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                         activeTab === 'chat'
                           ? 'text-indigo-700 border-b-2 border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50'
                           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                       }`}
                     >
                       <div className="flex items-center justify-center space-x-2">
                         <MessageCircle size={16} className={activeTab === 'chat' ? 'text-indigo-600' : 'text-gray-500'} />
                         <span>Chat</span>
                       </div>
                     </button>
                     <button
                       onClick={() => setActiveTab('dashboard')}
                       className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                         activeTab === 'dashboard'
                           ? 'text-indigo-700 border-b-2 border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50'
                           : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                       }`}
                     >
                             <div className="flex items-center justify-center space-x-2">
                 <BarChart3 size={16} className={activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-500'} />
                 <span>Dashboard</span>
               </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeTab === 'chat' && (
            <div className="transition-all duration-300 ease-in-out">
              <AudioRecorder onNewTransaction={handleNewTransaction} />
            </div>
          )}
          {activeTab === 'dashboard' && (
            <div className="transition-all duration-300 ease-in-out">
              <FinancialDashboard transactions={transactions} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Navigation Button */}
      <button
        onClick={toggleScreen}
        className="floating-button group"
        title={activeTab === 'chat' ? 'Ir para Dashboard' : 'Ir para Chat'}
      >
        <div className="relative">
          {activeTab === 'chat' ? <BarChart3 size={24} /> : <MessageCircle size={24} />}
          {/* Indicador de tela ativa */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
            activeTab === 'chat' 
              ? 'bg-green-400 shadow-lg shadow-green-400/50' 
              : 'bg-blue-400 shadow-lg shadow-blue-400/50'
          }`}></div>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {activeTab === 'chat' ? 'Dashboard' : 'Chat'}
        </div>
      </button>
    </div>
  )
}
