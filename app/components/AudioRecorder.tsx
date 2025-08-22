'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Loader2, Send, MessageSquare, Sparkles, DollarSign, Receipt, Tag, Plus, X } from 'lucide-react'

interface AudioRecorderProps {
  onNewTransaction: (transaction: any) => void
}

export default function AudioRecorder({ onNewTransaction }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [recognition, setRecognition] = useState<any>(null)
  const [categories, setCategories] = useState<Record<string, string[]>>({})
  const [newCategory, setNewCategory] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Carregar categorias padrão e personalizadas
    const defaultCategories = {
      'Alimentação': ['comida', 'restaurante', 'lanche', 'paçoca', 'doce', 'amendoim', 'pizza', 'hambúrguer', 'café', 'almoço', 'jantar'],
      'Transporte': ['uber', '99', 'taxi', 'ônibus', 'metrô', 'combustível', 'gasolina', 'etanol', 'estacionamento'],
      'Moradia': ['aluguel', 'condomínio', 'iptu', 'água', 'luz', 'energia', 'gás', 'internet', 'wifi'],
      'Saúde': ['médico', 'consulta', 'exame', 'remédio', 'farmácia', 'hospital', 'plano', 'saúde', 'dentista'],
      'Educação': ['escola', 'faculdade', 'universidade', 'curso', 'livro', 'material', 'mensalidade'],
      'Lazer': ['cinema', 'teatro', 'show', 'bar', 'balada', 'viagem', 'hotel', 'passeio', 'jogo'],
      'Vestuário': ['roupa', 'sapato', 'bolsa', 'acessório', 'loja', 'shopping'],
      'Serviços': ['manicure', 'cabeleireiro', 'lavanderia', 'limpeza', 'manutenção'],
      'Outros': []
    }

    const savedCategories = localStorage.getItem('financialCategories')
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      setCategories(defaultCategories)
      localStorage.setItem('financialCategories', JSON.stringify(defaultCategories))
    }
  }, [])

  useEffect(() => {
    // Inicializar Web Speech API com mais compatibilidade
    const initSpeechRecognition = () => {
      try {
        // Tentar diferentes implementações
        let SpeechRecognition = null
        
        if (typeof window !== 'undefined') {
          if ('webkitSpeechRecognition' in window) {
            SpeechRecognition = window.webkitSpeechRecognition
          } else if ('SpeechRecognition' in window) {
            SpeechRecognition = window.SpeechRecognition
          }
        }
        
                 if (SpeechRecognition) {
           const recognition = new (SpeechRecognition as any)()
          
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'pt-BR'
          
          recognition.onstart = () => {
            console.log('✅ Reconhecimento de voz iniciado')
          }
          
                     recognition.onresult = (event: any) => {
             console.log('🎤 Resultado do reconhecimento:', event.results)
             let finalTranscript = ''
             for (let i = event.resultIndex; i < event.results.length; i++) {
               if (event.results[i].isFinal) {
                 finalTranscript += event.results[i][0].transcript
               }
             }
             if (finalTranscript) {
               console.log('📝 Transcrição final:', finalTranscript)
               setTranscript(prev => prev + ' ' + finalTranscript)
             }
           }
          
                     recognition.onerror = (event: any) => {
             console.error('❌ Erro no reconhecimento de voz:', event.error)
             if (event.error === 'not-allowed') {
               alert('❌ Permissão negada para microfone. Clique no ícone de microfone na barra de endereços e permita o acesso.')
             } else {
               alert(`❌ Erro no reconhecimento: ${event.error}`)
             }
             setIsRecording(false)
           }
          
          recognition.onend = () => {
            console.log('🛑 Reconhecimento de voz finalizado')
            setIsRecording(false)
          }
          
          setRecognition(recognition)
          console.log('✅ Web Speech API inicializada com sucesso')
        } else {
          console.warn('⚠️ Web Speech API não suportada neste navegador')
          // Não mostrar alerta imediatamente, deixar o usuário tentar
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar Web Speech API:', error)
      }
    }
    
    // Aguardar um pouco para garantir que o DOM está carregado
    setTimeout(initSpeechRecognition, 100)
  }, [])

  const startRecording = async () => {
    try {
      console.log('🎤 Iniciando gravação...')
      
      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('❌ Seu navegador não suporta gravação de áudio. Use Chrome ou Edge.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('✅ Stream de áudio obtido:', stream)
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        console.log('📊 Dados de áudio disponíveis')
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        console.log('🛑 Gravação de áudio finalizada')
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        console.log('💾 Blob de áudio criado:', audioBlob.size, 'bytes')
      }

      mediaRecorder.start()
      console.log('✅ MediaRecorder iniciado')
      setIsRecording(true)
      setTranscript('')
      
      if (recognition) {
        console.log('🎤 Iniciando reconhecimento de voz...')
        try {
          recognition.start()
        } catch (error) {
          console.error('❌ Erro ao iniciar reconhecimento:', error)
          alert('❌ Erro ao iniciar reconhecimento de voz. Tente novamente.')
        }
      } else {
        console.warn('⚠️ Reconhecimento de voz não disponível - use entrada manual')
        alert('⚠️ Reconhecimento de voz não disponível no seu navegador.\n\nVocê pode:\n1. Usar Chrome ou Edge\n2. Digitar manualmente no campo de texto\n3. Usar o botão "Teste Rápido"')
      }
         } catch (error: any) {
       console.error('❌ Erro ao iniciar gravação:', error)
       if (error.name === 'NotAllowedError') {
        alert('❌ Permissão negada para microfone.\n\nPara resolver:\n1. Clique no ícone de microfone na barra de endereços\n2. Selecione "Permitir"\n3. Recarregue a página')
      } else if (error.name === 'NotFoundError') {
        alert('❌ Nenhum microfone encontrado.\n\nVerifique se:\n1. Há um microfone conectado\n2. O microfone está funcionando\n3. Não está sendo usado por outro aplicativo')
      } else {
        alert(`❌ Erro ao acessar microfone: ${error.message}`)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (recognition) {
      recognition.stop()
    }
    
    setIsRecording(false)
  }

  const addNewCategory = () => {
    if (newCategory.trim() && !categories[newCategory.trim()]) {
      const updatedCategories = {
        ...categories,
        [newCategory.trim()]: []
      }
      setCategories(updatedCategories)
      localStorage.setItem('financialCategories', JSON.stringify(updatedCategories))
      setNewCategory('')
      setShowCategoryInput(false)
    }
  }

  const addKeywordToCategory = (categoryName: string) => {
    if (newKeyword.trim() && selectedCategory === categoryName) {
      const updatedCategories = {
        ...categories,
        [categoryName]: [...categories[categoryName], newKeyword.trim()]
      }
      setCategories(updatedCategories)
      localStorage.setItem('financialCategories', JSON.stringify(updatedCategories))
      setNewKeyword('')
      setSelectedCategory('')
    }
  }

  const removeKeyword = (categoryName: string, keyword: string) => {
    const updatedCategories = {
      ...categories,
      [categoryName]: categories[categoryName].filter(k => k !== keyword)
    }
    setCategories(updatedCategories)
    localStorage.setItem('financialCategories', JSON.stringify(updatedCategories))
  }

  const removeCategory = (categoryName: string) => {
    if (categoryName !== 'Outros') { // Não permitir remover categoria 'Outros'
      const updatedCategories = { ...categories }
      delete updatedCategories[categoryName]
      setCategories(updatedCategories)
      localStorage.setItem('financialCategories', JSON.stringify(updatedCategories))
    }
  }

  const processAudio = async () => {
    const textToProcess = manualInput.trim() || transcript.trim()
    
    if (!textToProcess) {
      alert('Por favor, grave um áudio ou digite uma transação')
      return
    }

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: textToProcess,
          categories: categories 
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar transação')
      }

      const transaction = await response.json()
      onNewTransaction(transaction)
      
      // Limpar campos
      setTranscript('')
      setManualInput('')
      
      // Mostrar mensagem de sucesso no chat
      setTimeout(() => {
        const successMessage = document.createElement('div')
        successMessage.className = 'message message-ai'
        successMessage.innerHTML = `
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
                             <p class="font-semibold text-gray-900 text-sm mb-1">Financeiro AI</p>
               <p class="text-gray-800 font-medium">Transação processada com sucesso!</p>
               <p class="text-sm text-indigo-800 mt-1 flex items-center gap-1 font-semibold">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                ${transaction.description} - R$ ${transaction.amount.toFixed(2)} (${transaction.category})
              </p>
            </div>
          </div>
        `
        const chatMessages = document.querySelector('.chat-messages')
        if (chatMessages) {
          chatMessages.appendChild(successMessage)
          chatMessages.scrollTop = chatMessages.scrollHeight
        }
      }, 500)
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar transação. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="chat-messages flex-1">
        {/* Welcome Message */}
        <div className="message message-ai">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
                             <p className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                 <span>Financeiro AI</span>
                 <span className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-full text-indigo-800 border-2 border-indigo-300 font-semibold">Assistente</span>
               </p>
                             <p className="text-gray-800 font-medium">Olá! Sou seu assistente financeiro. Posso ajudar você a organizar suas despesas e receitas.</p>
               <p className="text-xs text-indigo-700 mt-2 flex items-center gap-1 font-semibold">
                 <MessageSquare size={12} />
                 Dica: Fale naturalmente como "gastei R$ 150 na luz" ou digite suas despesas.
               </p>
            </div>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="message message-ai">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-md">
                <Mic size={12} className="text-white animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="pulse-dots">
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot" style={{animationDelay: '0.1s'}}></div>
                  <div className="pulse-dot" style={{animationDelay: '0.2s'}}></div>
                </div>
                                 <span className="text-sm text-indigo-800 font-semibold">Gravando... Fale suas despesas</span>
              </div>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="message message-user">
            <div className="flex items-center gap-2">
              <Mic size={14} />
              <p>{transcript}</p>
            </div>
          </div>
        )}

        {/* Manual Input Preview */}
        {manualInput && !transcript && (
          <div className="message message-user">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} />
              <p>{manualInput}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        {/* Manual Input */}
        <div className="mb-3">
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Digite suas despesas aqui..."
            className="input-field"
            rows={2}
            disabled={isProcessing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Microphone Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`btn-icon ${isRecording ? 'btn-mic-recording' : 'btn-mic'}`}
            title={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Send Button */}
          <button
            onClick={processAudio}
            disabled={isProcessing || (!transcript.trim() && !manualInput.trim())}
            className="btn-icon btn-send flex-1"
            title="Processar transação"
          >
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Quick Test Buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setManualInput('Gastei R$ 150 na conta de luz')}
            className="btn-test text-xs px-3 py-1 flex items-center gap-1"
          >
            <Receipt size={12} />
            Teste Rápido
          </button>
          <button
            onClick={() => setManualInput('R$ 30 em paçoca, R$ 200 no plano médico')}
            className="btn-test text-xs px-3 py-1 flex items-center gap-1"
          >
            <MessageSquare size={12} />
            Múltiplas
          </button>
          <button
            onClick={() => setManualInput('Recebi R$ 3000 de salário')}
            className="btn-test text-xs px-3 py-1 flex items-center gap-1"
          >
            <DollarSign size={12} />
            Receita
          </button>
        </div>
      </div>

      {/* Categories Management Section */}
      <div className="dashboard-card mt-4 mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="text-indigo-600" size={18} />
            <h3 className="text-lg font-bold text-gray-800">Categorias</h3>
          </div>
          <button
            onClick={() => setShowCategoryInput(!showCategoryInput)}
            className="btn-icon btn-send text-xs px-3 py-1"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add New Category */}
        {showCategoryInput && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome da nova categoria..."
                className="flex-1 px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && addNewCategory()}
              />
              <button
                onClick={addNewCategory}
                className="btn-icon btn-send text-xs px-3 py-1"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(categories).map(([categoryName, keywords]) => (
            <div key={categoryName} className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 rounded-xl border-2 border-indigo-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">{categoryName}</h4>
                {categoryName !== 'Outros' && (
                  <button
                    onClick={() => removeCategory(categoryName)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mb-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full border border-indigo-200"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(categoryName, keyword)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Keyword */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedCategory === categoryName ? newKeyword : ''}
                  onChange={(e) => {
                    setNewKeyword(e.target.value)
                    setSelectedCategory(categoryName)
                  }}
                  placeholder="Adicionar palavra-chave..."
                  className="flex-1 px-2 py-1 text-xs border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && addKeywordToCategory(categoryName)}
                />
                <button
                  onClick={() => addKeywordToCategory(categoryName)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
