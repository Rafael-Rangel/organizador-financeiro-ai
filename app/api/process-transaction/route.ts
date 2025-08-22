import { NextRequest, NextResponse } from 'next/server'

// Função para extrair valores monetários do texto
function extractAmount(text: string): number {
  const regex = /R?\$?\s*(\d+[.,]?\d*)/gi
  const matches = text.match(regex)
  if (matches) {
    // Pega o primeiro valor encontrado
    const value = matches[0].replace(/R?\$?\s*/gi, '').replace(',', '.')
    return parseFloat(value)
  }
  return 0
}

// Função para categorizar despesas baseada em palavras-chave
function categorizeTransaction(text: string, customCategories?: Record<string, string[]>): string {
  const lowerText = text.toLowerCase()
  
  // Categorias padrão como fallback
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

  // Usar categorias personalizadas se fornecidas, senão usar padrão
  const categories = customCategories || defaultCategories

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category
    }
  }

  return 'Outros'
}

// Função para detectar bancos mencionados
function extractBank(text: string): string | undefined {
  const lowerText = text.toLowerCase()
  const banks = [
    'nubank', 'itau', 'itaú', 'bradesco', 'santander', 'banco do brasil', 'bb', 
    'caixa', 'inter', 'c6', 'picpay', 'mercado pago', 'pagseguro'
  ]
  
  for (const bank of banks) {
    if (lowerText.includes(bank)) {
      return bank.charAt(0).toUpperCase() + bank.slice(1)
    }
  }
  
  return undefined
}

// Função para determinar se é receita ou despesa
function determineTransactionType(text: string): 'expense' | 'income' {
  const lowerText = text.toLowerCase()
  const incomeKeywords = ['recebi', 'ganhei', 'salário', 'pagamento', 'bonus', 'bônus', 'comissão']
  const expenseKeywords = ['gastei', 'paguei', 'comprei', 'despesa', 'conta']
  
  if (incomeKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'income'
  }
  
  if (expenseKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'expense'
  }
  
  // Por padrão, assume que é despesa se tem valor
  return 'expense'
}

// Função para criar descrição limpa
function createDescription(text: string): string {
  // Remove valores monetários e palavras desnecessárias
  let description = text
    .replace(/R?\$?\s*\d+[.,]?\d*/gi, '') // Remove valores
    .replace(/\b(gastei|paguei|comprei|recebi|ganhei)\b/gi, '') // Remove verbos de ação
    .replace(/\b(com|na|no|em|de|da|do)\b/gi, '') // Remove preposições
    .trim()
    .replace(/\s+/g, ' ') // Remove espaços extras
  
  // Capitaliza primeira letra
  return description.charAt(0).toUpperCase() + description.slice(1)
}

export async function POST(request: NextRequest) {
  try {
    const { text, categories: customCategories } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      )
    }

    // Extrair informações do texto
    const amount = extractAmount(text)
    const category = categorizeTransaction(text, customCategories)
    const bank = extractBank(text)
    const type = determineTransactionType(text)
    const description = createDescription(text)

    // Validações
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Não foi possível identificar um valor válido no texto' },
        { status: 400 }
      )
    }

    // Criar objeto da transação
    const transaction = {
      description: description || 'Transação não categorizada',
      amount: amount,
      category: category,
      type: type,
      bank: bank,
      date: new Date().toISOString()
    }

    // Se você quiser usar IA mais avançada, pode integrar com Hugging Face aqui
    // Por enquanto, estamos usando regras simples que funcionam bem para o caso de uso

    return NextResponse.json(transaction)

  } catch (error) {
    console.error('Erro ao processar transação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função alternativa usando Hugging Face (gratuita)
async function processWithHuggingFace(text: string) {
  try {
    // Você pode usar a API gratuita do Hugging Face
    // Exemplo com modelo de classificação de texto
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN || 'hf_...'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            candidate_labels: [
              'Alimentação', 'Transporte', 'Moradia', 'Saúde', 
              'Educação', 'Lazer', 'Vestuário', 'Serviços', 'Outros'
            ]
          }
        }),
      }
    )

    if (response.ok) {
      const result = await response.json()
      return result
    }
  } catch (error) {
    console.error('Erro ao usar Hugging Face:', error)
  }
  
  return null
}
