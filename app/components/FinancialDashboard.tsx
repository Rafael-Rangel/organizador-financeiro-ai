'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Download, Trash2, Filter, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react'

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  category: string
  type: 'expense' | 'income'
  bank?: string
}

interface FinancialDashboardProps {
  transactions: Transaction[]
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#a855f7', '#c084fc', '#f97316', '#84cc16']

export default function FinancialDashboard({ transactions }: FinancialDashboardProps) {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

  // Filtrar transações
  const filterTransactions = () => {
    let filtered = transactions

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    if (selectedMonth !== 'all') {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date)
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`
        return transactionMonth === selectedMonth
      })
    }

    // Ordenar por data (mais recente primeiro)
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredTransactions(filtered)
  }

  useEffect(() => {
    filterTransactions()
  }, [selectedCategory, selectedMonth, transactions])

  // Calcular estatísticas
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Dados para gráficos
  const categoryData = Object.entries(
    filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
  ).map(([category, amount]) => ({ category, amount }))

  const monthlyData = Object.entries(
    filteredTransactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      if (!acc[month]) acc[month] = { expenses: 0, income: 0 }
      if (t.type === 'expense') acc[month].expenses += t.amount
      else acc[month].income += t.amount
      return acc
    }, {} as Record<string, { expenses: number; income: number }>)
  ).map(([month, data]) => ({ month, ...data }))

  // Categorias únicas
  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))]

  // Meses únicos
  const months = ['all', ...Array.from(new Set(transactions.map(t => {
    const date = new Date(t.date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  })))]

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Valor', 'Categoria', 'Tipo', 'Banco']
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        `"${t.description}"`,
        t.amount.toFixed(2),
        t.category,
        t.type,
        t.bank || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const deleteTransaction = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id)
      localStorage.setItem('financialTransactions', JSON.stringify(updatedTransactions))
      window.location.reload()
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Resumo Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card-income">
          <div className="flex items-center justify-between">
            <div>
                             <h3 className="text-xs font-bold text-white opacity-95 mb-1 flex items-center gap-1">
                 <TrendingUp size={12} className="text-white" />
                 Receitas
               </h3>
               <p className="text-xl font-bold text-white drop-shadow-sm">
                 R$ {totalIncome.toFixed(0)}
               </p>
            </div>
          </div>
        </div>
        <div className="stat-card-expense">
          <div className="flex items-center justify-between">
            <div>
                             <h3 className="text-xs font-bold text-white opacity-95 mb-1 flex items-center gap-1">
                 <TrendingDown size={12} className="text-white" />
                 Despesas
               </h3>
               <p className="text-xl font-bold text-white drop-shadow-sm">
                 R$ {totalExpenses.toFixed(0)}
               </p>
            </div>
          </div>
        </div>
        <div className={`stat-card ${balance >= 0 ? 'stat-card-income' : 'stat-card-expense'}`}>
          <div className="flex items-center justify-between">
            <div>
                             <h3 className="text-xs font-bold text-white opacity-95 mb-1 flex items-center gap-1">
                 <DollarSign size={12} className="text-white" />
                 Saldo
               </h3>
               <p className="text-xl font-bold text-white drop-shadow-sm">
                 R$ {balance.toFixed(0)}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Compactos */}
      <div className="dashboard-card">
        <div className="novoestilo">
                     <select
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             className="flex-1 px-3 py-2 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
             style={{
               border: '2px solid transparent',
               backgroundImage: 'linear-gradient(to bottom right, white, #eff6ff, #e0e7ff), linear-gradient(to bottom right, #6366f1, #8b5cf6, #a855f7)',
               backgroundOrigin: 'border-box',
               backgroundClip: 'padding-box, border-box'
             }}
           >
             {categories.map(cat => (
               <option key={cat} value={cat}>
                 {cat === 'all' ? 'Todas categorias' : cat}
               </option>
             ))}
           </select>
           <select
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
             className="flex-1 px-3 py-2 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
             style={{
               border: '2px solid transparent',
               backgroundImage: 'linear-gradient(to bottom right, white, #eff6ff, #e0e7ff), linear-gradient(to bottom right, #6366f1, #8b5cf6, #a855f7)',
               backgroundOrigin: 'border-box',
               backgroundClip: 'padding-box, border-box'
             }}
           >
             {months.map(month => (
               <option key={month} value={month}>
                 {month === 'all' ? 'Todos meses' : month}
               </option>
             ))}
           </select>
          <button
            onClick={exportToCSV}
            className="btn-secondary px-3 py-2 text-sm"
            title="Exportar dados"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

             {/* Gráficos Interativos */}
       <div className="dashboard-card">
                   <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-600" />
            Despesas por Categoria
          </h3>
         <ResponsiveContainer width="100%" height={250}>
           <PieChart>
             <Pie
               data={categoryData}
               cx="50%"
               cy="50%"
               labelLine={false}
               label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
               outerRadius={80}
               innerRadius={30}
               fill="#8884d8"
               dataKey="amount"
               paddingAngle={2}
             >
               {categoryData.map((entry, index) => (
                 <Cell 
                   key={`cell-${index}`} 
                   fill={COLORS[index % COLORS.length]}
                   stroke="#fff"
                   strokeWidth={2}
                 />
               ))}
             </Pie>
             <Tooltip 
               formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
               contentStyle={{
                 backgroundColor: 'rgba(255, 255, 255, 0.95)',
                 border: '1px solid #e5e7eb',
                 borderRadius: '12px',
                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
               }}
             />
           </PieChart>
         </ResponsiveContainer>
       </div>

       <div className="dashboard-card">
                   <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Despesas e Receitas por Mês
          </h3>
         <ResponsiveContainer width="100%" height={250}>
           <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
             <XAxis 
               dataKey="month" 
               tick={{ fontSize: 12, fill: '#6b7280' }}
               axisLine={{ stroke: '#e5e7eb' }}
             />
             <YAxis 
               tick={{ fontSize: 12, fill: '#6b7280' }}
               axisLine={{ stroke: '#e5e7eb' }}
             />
             <Tooltip 
               formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
               contentStyle={{
                 backgroundColor: 'rgba(255, 255, 255, 0.95)',
                 border: '1px solid #e5e7eb',
                 borderRadius: '12px',
                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
               }}
             />
             <Legend 
               wrapperStyle={{
                 paddingTop: '10px'
               }}
             />
             <Bar 
               dataKey="expenses" 
               fill="url(#expenseGradient)" 
               name="Despesas"
               radius={[4, 4, 0, 0]}
             />
             <Bar 
               dataKey="income" 
               fill="url(#incomeGradient)" 
               name="Receitas"
               radius={[4, 4, 0, 0]}
             />
             <defs>
               <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                 <stop offset="95%" stopColor="#dc2626" stopOpacity={0.9}/>
               </linearGradient>
               <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                 <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
               </linearGradient>
             </defs>
           </BarChart>
         </ResponsiveContainer>
       </div>

      {/* Lista de Transações Compacta */}
      <div className="dashboard-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" />
            Transações Recentes
          </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredTransactions.slice(0, 8).map((transaction) => (
                         <div key={transaction.id} className="flex items-center justify-between p-3 rounded-2xl shadow-sm" style={{
               border: '2px solid transparent',
               backgroundImage: 'linear-gradient(to bottom right, white, #eff6ff, #e0e7ff), linear-gradient(to bottom right, #6366f1, #8b5cf6, #a855f7)',
               backgroundOrigin: 'border-box',
               backgroundClip: 'padding-box, border-box'
             }}>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                                     <span className="text-sm font-semibold text-gray-900">
                     {transaction.description}
                   </span>
                   <span className="text-xs text-gray-600 font-medium">
                     {new Date(transaction.date).toLocaleDateString('pt-BR')}
                   </span>
                </div>
                                 <div className="flex items-center space-x-2 mt-1">
                                       <span className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-2 py-1 rounded-full border border-indigo-300 font-semibold">
                      {transaction.category}
                    </span>
                    {transaction.bank && (
                      <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full border border-purple-300 font-semibold">
                        {transaction.bank}
                      </span>
                    )}
                 </div>
              </div>
              <div className="flex items-center space-x-2">
                                 <span className={`text-sm font-bold ${
                   transaction.type === 'expense' ? 'text-red-700' : 'text-indigo-700'
                 }`}>
                   R$ {transaction.amount.toFixed(0)}
                 </span>
                                   <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-indigo-600 hover:text-red-700 text-xs transition-colors"
                    title="Deletar"
                  >
                    <Trash2 size={14} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
