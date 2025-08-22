# 🎤 Organizador Financeiro AI

Um aplicativo web gratuito que converte áudio em dados financeiros organizados usando IA. Perfeito para controlar suas despesas e receitas de forma simples e intuitiva.

## ✨ Funcionalidades

- 🎤 **Gravação de áudio** com reconhecimento de voz em português
- 🤖 **IA gratuita** para categorização automática de despesas
- 📊 **Dashboard interativo** com gráficos e estatísticas
- 💾 **Armazenamento local** (localStorage) - sem necessidade de banco de dados
- 📱 **Interface responsiva** que funciona em qualquer dispositivo
- 📤 **Exportação para CSV** dos seus dados
- 🆓 **100% gratuito** - sem custos de hospedagem ou APIs

## 🚀 Como usar

### 1. Instalação Local

```bash
# Clone o repositório
git clone <seu-repositorio>
cd organizador-financeiro-ai

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

### 2. Deploy no Vercel (Recomendado)

#### Opção A: Deploy Automático
```bash
# Execute o script de deploy
chmod +x deploy.sh
./deploy.sh
```

#### Opção B: Deploy Manual
1. **Crie repositório no GitHub:**
   - Acesse: https://github.com/new
   - Nome: `organizador-financeiro-ai`
   - Público

2. **Configure Git:**
   ```bash
   git init
   git add .
   git commit -m "🎉 Primeira versão"
   git remote add origin https://github.com/SEU_USUARIO/organizador-financeiro-ai.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy no Vercel:**
   - Acesse: https://vercel.com
   - Login com GitHub
   - "New Project" → Importe o repositório
   - Clique "Deploy"

**Seu site estará online em minutos!** 🌐

## 🎯 Como funciona

### Gravação de Áudio
1. Clique no botão de gravação
2. Fale suas despesas naturalmente
3. Exemplos de fala:
   - "Gastei R$ 150 na conta de luz"
   - "R$ 30 em paçoca"
   - "Plano médico R$ 200 pelo Nubank"
   - "Recebi R$ 3000 de salário"

### Processamento com IA
O sistema automaticamente:
- Extrai valores monetários
- Categoriza despesas (Alimentação, Transporte, Moradia, etc.)
- Identifica bancos mencionados
- Determina se é receita ou despesa

### Dashboard
- Visualize gastos por categoria
- Acompanhe receitas vs despesas
- Filtre por período e categoria
- Exporte dados para Excel

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Web Speech API** - Reconhecimento de voz
- **Vercel** - Hospedagem gratuita

## 📊 Categorias Suportadas

- **Alimentação**: comida, restaurante, lanche, paçoca, etc.
- **Transporte**: Uber, 99, combustível, estacionamento
- **Moradia**: aluguel, água, luz, internet, condomínio
- **Saúde**: médico, farmácia, plano de saúde, consulta
- **Educação**: escola, curso, material escolar
- **Lazer**: cinema, teatro, viagem, bar
- **Vestuário**: roupa, sapato, acessórios
- **Serviços**: manicure, cabeleireiro, limpeza
- **Outros**: categorias não identificadas

## 🏦 Bancos Reconhecidos

- Nubank, Itaú, Bradesco, Santander
- Banco do Brasil, Caixa, Inter
- C6, PicPay, Mercado Pago, PagSeguro

## 🔧 Configuração Avançada

### Usando IA mais avançada (Opcional)

Para usar modelos de IA mais sofisticados, você pode:

1. **Hugging Face** (Gratuito):
   ```bash
   # Adicione sua chave API no .env.local
   HUGGING_FACE_TOKEN=sua_chave_aqui
   ```

2. **Funcionalidades Principais:**
   - Reconhecimento de voz para transações
   - Categorização automática
   - Dashboard com gráficos
   - Exportação CSV

### Personalização

- Edite `app/api/process-transaction/route.ts` para adicionar novas categorias
- Modifique `app/components/FinancialDashboard.tsx` para novos gráficos
- Personalize cores em `tailwind.config.js`

## 📱 Compatibilidade

- ✅ Chrome/Edge (reconhecimento de voz completo)
- ✅ Firefox (reconhecimento de voz básico)
- ✅ Safari (reconhecimento de voz básico)
- ✅ Mobile (iOS/Android)

## 🆘 Solução de Problemas

### Microfone não funciona
- Verifique as permissões do navegador
- Use HTTPS (necessário para microfone)
- Teste em navegadores diferentes

### IA não categoriza corretamente
- Fale de forma clara e natural
- Use palavras-chave das categorias
- Edite manualmente se necessário

### Dados não salvam
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador
- Use modo incógnito para testar

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎉 Próximas Funcionalidades

- [ ] Backup na nuvem
- [ ] Backup na nuvem
- [ ] Notificações de contas vencendo
- [ ] Metas financeiras
- [ ] Relatórios mensais
- [ ] Integração com WhatsApp

---

**Desenvolvido com ❤️ para facilitar o controle financeiro pessoal**
