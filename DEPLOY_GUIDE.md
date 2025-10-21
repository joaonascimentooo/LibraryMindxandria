# Guia completo de publicação — LibraryMindxandria

Este guia detalha como publicar o frontend na Vercel e o backend no Railway (ou qualquer outro provedor). Ambos os serviços oferecem plano gratuito para começar.

---

## Parte 1: Publicar o backend (Spring Boot + PostgreSQL)

### Opção A: Railway (recomendado — mais fácil)

1. **Criar conta no Railway**
   - Acesse [railway.app](https://railway.app) e crie uma conta (pode usar GitHub).

2. **Criar um novo projeto**
   - Clique em "New Project".
   - Selecione "Deploy from GitHub repo".
   - Autorize o Railway a acessar seu repositório `LibraryMindxandria`.

3. **Adicionar PostgreSQL**
   - No projeto Railway, clique em "+ New".
   - Selecione "Database" → "PostgreSQL".
   - O Railway cria um banco automaticamente e expõe variáveis de ambiente.

4. **Configurar o serviço do backend**
   - Clique em "+ New" → "GitHub Repo" → selecione `LibraryMindxandria`.
   - Em "Settings":
     - **Root Directory**: `backend`
     - **Build Command**: `./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   
5. **Adicionar variáveis de ambiente** (aba "Variables" do serviço backend)
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
   JWT_SECRET=SEU_SECRET_AQUI_MINIMO_256_BITS
   JWT_EXPIRATION_MS=600000
   JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```
   
   **Importante**: gere um `JWT_SECRET` forte. Exemplo rápido no terminal:
   ```bash
   openssl rand -base64 64
   ```

6. **Deploy**
   - O Railway automaticamente faz o deploy.
   - Após o build, você terá uma URL pública (ex.: `https://seu-backend.up.railway.app`).
   - Copie essa URL — você vai usá-la no frontend.

7. **Teste**
   - Abra `https://seu-backend.up.railway.app/auth/login` no navegador (deve retornar erro 405 ou 401, indicando que a API está ativa).

---

### Opção B: Render

1. **Criar conta no Render**
   - Acesse [render.com](https://render.com) e crie uma conta.

2. **Criar PostgreSQL**
   - Dashboard → "New +" → "PostgreSQL".
   - Escolha o plano gratuito.
   - Anote a **Internal Database URL** (algo como `postgres://...`).

3. **Criar Web Service**
   - Dashboard → "New +" → "Web Service".
   - Conecte seu repositório GitHub `LibraryMindxandria`.
   - **Root Directory**: `backend`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

4. **Adicionar variáveis de ambiente**
   ```
   SPRING_DATASOURCE_URL=<Internal Database URL do PostgreSQL>
   SPRING_DATASOURCE_USERNAME=<usuário do banco>
   SPRING_DATASOURCE_PASSWORD=<senha do banco>
   JWT_SECRET=<gere um secret forte>
   JWT_EXPIRATION_MS=600000
   JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```

5. **Deploy**
   - O Render faz o deploy automaticamente.
   - Copie a URL pública (ex.: `https://seu-backend.onrender.com`).

---

## Parte 2: Publicar o frontend (Next.js) na Vercel

1. **Criar conta na Vercel**
   - Acesse [vercel.com](https://vercel.com) e crie uma conta (pode usar GitHub).

2. **Importar projeto**
   - Dashboard → "Add New..." → "Project".
   - Selecione o repositório `LibraryMindxandria`.

3. **Configurar o projeto**
   - **Root Directory**: `frontend` (IMPORTANTE!)
   - **Framework Preset**: Next.js (auto-detectado)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

4. **Adicionar variável de ambiente**
   - Antes de fazer deploy, clique em "Environment Variables".
   - Adicione:
     ```
     NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
     ```
     (ou a URL do Render, se escolheu o Render)
   - Marque para usar em **Production**, **Preview** e **Development**.

5. **Deploy**
   - Clique em "Deploy".
   - A Vercel vai construir e publicar seu frontend.
   - Você receberá uma URL (ex.: `https://library-mindxandria.vercel.app`).

6. **Teste**
   - Abra a URL da Vercel no navegador.
   - Tente fazer login/registro — deve funcionar conectando ao backend.

---

## Parte 3: Ajustes pós-deploy

### Se aparecer erro de CORS no navegador

- Verifique se o backend está permitindo a origem correta.
- O `SecurityConfig.java` já está configurado para aceitar `https://*.vercel.app`.
- Se usar domínio customizado na Vercel, adicione esse domínio na lista de origens permitidas no backend.

### Se o frontend não conseguir conectar ao backend

- Confirme que `NEXT_PUBLIC_API_URL` está correta na Vercel.
- Teste a URL do backend diretamente no navegador (ex.: `https://seu-backend.up.railway.app/auth/login`).
- Verifique os logs do backend no Railway/Render para ver se há erros.

### Atualizar código

- Sempre que fizer push para `main`, tanto Railway quanto Vercel fazem redeploy automaticamente.
- Se mudou variáveis de ambiente, faça redeploy manual (no Railway/Vercel dashboard).

---

## Checklist rápido

Frontend (Vercel):
- [ ] Repositório conectado
- [ ] Root Directory = `frontend`
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Deploy concluído

Backend (Railway/Render):
- [ ] PostgreSQL criado
- [ ] Serviço backend configurado (Root Directory = `backend`)
- [ ] Variáveis de ambiente (DB, JWT_SECRET) adicionadas
- [ ] Deploy concluído
- [ ] URL pública funcionando

---

## Custos

- **Vercel**: gratuito para hobbies (bandwidth e builds limitados).
- **Railway**: $5 de crédito grátis/mês (suficiente para projetos pequenos).
- **Render**: plano gratuito com limitações (instâncias dormem após 15 min de inatividade).

---

## Precisa de ajuda?

- Railway docs: [docs.railway.app](https://docs.railway.app)
- Render docs: [render.com/docs](https://render.com/docs)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)

Qualquer dúvida, consulte os logs nos dashboards de cada serviço.
