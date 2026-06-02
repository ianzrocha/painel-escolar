# 🚀 Guia de Deploy - Railway.app

## Passo 1: Preparar o Projeto

### 1.1 Criar arquivo `.env.local` (gitignore)
```bash
# Copie o .env.example para .env.local
cp .env.example .env.local
```

### 1.2 Instalar dependências
```bash
npm install
```

### 1.3 Fazer commit das mudanças
```bash
git add .
git commit -m "feat: configure for Railway deployment"
git push origin main
```

---

## Passo 2: Criar conta no Railway.app

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Escolha **"Deploy from GitHub"**
4. Autorize o acesso ao seu repositório

---

## Passo 3: Configurar no Railway

### 3.1 Selecione seu repositório
- Escolha o repositório `painel-escolar`

### 3.2 Adicionar PostgreSQL
1. Clique em **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Aguarde criação (Railway cria automaticamente)

### 3.3 Conectar banco ao projeto
1. Clique no seu projeto
2. Vá em **"Variables"**
3. O Railway vai mostrar automaticamente: `DATABASE_URL`
4. Configure as demais variáveis:
   - `NODE_ENV=production`
   - `PORT=8080`

### 3.4 Deploy
1. Railway fará deploy automático ao detectar mudanças no Git
2. Ou clique em **"Deploy"** manualmente

---

## Passo 4: Verificar Deploy

- Acesse a URL fornecida pelo Railway
- Verifique os logs: **"View Logs"** no dashboard

---

## ⚠️ Troubleshooting

### "Build failed"
- Verifique se `npm run build` funciona localmente
- Confira `package.json` - scripts devem estar corretos

### "Database connection error"
- Confirme que `DATABASE_URL` está nas variáveis
- Railway cria automaticamente ao adicionar PostgreSQL

### "Port not listening"
- Certifique-se que `PORT=8080` está configurado
- Seu servidor deve escutar em `process.env.PORT`

---

## 📌 Próximas Etapas

1. ✅ Configure variáveis de ambiente
2. ✅ Faça push para GitHub
3. ✅ Railway fará deploy automático
4. ✅ Acesse sua URL pública

**Dúvidas?** Chame-me! 🎯
