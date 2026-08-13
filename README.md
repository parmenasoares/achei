# ACHEII - Marketplace Automotivo 🚗⚙️

Marketplace de peças automotivas que conecta clientes, oficinas e fornecedores.

## 🎯 Visão

Ser o Mercado Livre das peças automotivas do Brasil.

## 🏗️ Tech Stack

- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Backend**: NestJS + PostgreSQL
- **Database**: Supabase
- **Hosting**: Vercel
- **Version Control**: GitHub

## 🚀 Deploy

### Vercel

```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel
```

### Supabase

1. Ir em https://supabase.com
2. Criar novo projeto
3. Adicionar variáveis de ambiente

## 📝 Setup Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/acheii.git
cd acheii

# Criar arquivo .env.local
cp .env.example .env.local

# Adicionar suas credenciais Supabase no .env.local

# Abrir no navegador
open index.html
```

## 🔑 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

## 📊 Funcionalidades

- ✅ Busca de peças
- ✅ Localizador de oficinas
- ✅ Sistema de pedidos
- ✅ Chat com IA
- ✅ Painel administrativo
- ✅ Sistema de avaliações

## 🔄 CI/CD

Commits em `main` fazem deploy automático no Vercel.

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ por [Seu Nome]**
