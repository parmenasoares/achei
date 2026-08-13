# 🚀 Setup Completo - ACHEII + GitHub + Supabase + Vercel

## PASSO 1: Criar Repositório no GitHub

```bash
# Opção A: Se não tem repo ainda
1. Ir em https://github.com/new
2. Nome: acheii
3. Descrição: Marketplace de peças automotivas
4. Adicionar .gitignore: JavaScript
5. Criar repositório

# Opção B: Se já tem repo local
cd ~/seu-projeto-acheii
git remote add origin https://github.com/seu-usuario/acheii.git
git branch -M main
```

## PASSO 2: Fazer Commit Inicial

```bash
# Clone (se criou online)
git clone https://github.com/seu-usuario/acheii.git
cd acheii

# Ou (se é local)
cd ~/seu-projeto-acheii

# Copiar os arquivos daqui pra lá:
# - index.html
# - .gitignore
# - .env.example
# - vercel.json
# - README.md

# Adicionar ao Git
git add .
git commit -m "Initial commit: ACHEII MVP"
git push -u origin main
```

## PASSO 3: Criar Projeto no Supabase

```
1. Ir em https://supabase.com
2. Click "Start your project"
3. Email/GitHub login
4. Criar novo projeto
   - Nome: acheii-prod
   - Região: São Paulo (sa-east-1)
   - Senha: salve em local seguro
5. Aguardar inicializar (2-3 min)
```

## PASSO 4: Criar Tabelas no Supabase

Ir em **Dashboard → SQL Editor** e rodar:

```sql
-- Tabela de produtos
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  store_id BIGINT,
  rating DECIMAL(3,1),
  reviews INT DEFAULT 0,
  badge VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50), -- 'cliente', 'vendedor', 'admin'
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de oficinas
CREATE TABLE stores (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'autopeca', 'oficina', 'desmonte'
  city VARCHAR(100),
  rating DECIMAL(3,1),
  reviews INT DEFAULT 0,
  icon VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  total DECIMAL(10, 2),
  status VARCHAR(50), -- 'pending', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (segurança)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies (qualquer um pode ler)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);
```

## PASSO 5: Copiar Credenciais Supabase

```
Dashboard do Supabase → Settings → API

Copiar:
- Project URL: https://xxxx.supabase.co
- anon public key: eyJhbG...

Adicionar no .env.local:
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## PASSO 6: Deploy no Vercel

```bash
# Opção A: Via CLI
npm install -g vercel
vercel login
vercel

# Opção B: Via Dashboard
1. Ir em https://vercel.com/new
2. Conectar GitHub
3. Importar repositório "acheii"
4. Deixar tudo padrão
5. Deploy!
```

## PASSO 7: Configurar Variáveis de Ambiente no Vercel

```
Dashboard Vercel → Seu Projeto → Settings → Environment Variables

Adicionar:
- VITE_SUPABASE_URL = sua-url
- VITE_SUPABASE_ANON_KEY = sua-chave

Redeploy automático!
```

## PASSO 8: Testar Tudo

```bash
# Local
cp .env.example .env.local
# Editar .env.local com suas credenciais
open index.html

# Production (Vercel URL)
https://acheii.vercel.app
```

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Projeto criado no Supabase
- [ ] Tabelas criadas
- [ ] .env.local configurado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente no Vercel
- [ ] Primeiro deploy feito
- [ ] URL pública funcionando

## 🔗 Links Úteis

- GitHub: https://github.com/seu-usuario/acheii
- Vercel: https://vercel.com/seu-usuario/acheii
- Supabase: https://supabase.com/projects

## 📞 Troubleshooting

**Erro de CORS?**
```
Supabase → API → CORS - adicionar seu domínio Vercel
```

**Variáveis não reconhecidas?**
```
Vercel → Redeploy (as variáveis não pegam na primeira vez)
```

**GitHub push rejeitado?**
```bash
git pull origin main
git push -u origin main
```

---

Pronto! Seu ACHEII tá online 🚀
