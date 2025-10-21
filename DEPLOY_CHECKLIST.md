# Checklist de Publicação — LibraryMindxandria

Use este checklist para garantir que tudo está configurado corretamente antes e depois do deploy.

## ✅ Pré-requisitos

- [ ] Código commitado e pushado para o GitHub
- [ ] PostgreSQL configurado localmente e testado
- [ ] Backend compila sem erros (`./mvnw clean package -DskipTests`)
- [ ] Frontend compila sem erros (`npm run build`)
- [ ] Conta criada no Railway (ou Render/Fly.io)
- [ ] Conta criada na Vercel

---

## 🗄️ Backend (Railway)

### Setup inicial
- [ ] Criado novo projeto no Railway
- [ ] Adicionado PostgreSQL ao projeto
- [ ] Conectado repositório GitHub ao Railway

### Configuração do serviço
- [ ] Root Directory definido como `backend`
- [ ] Build Command: `./mvnw clean package -DskipTests`
- [ ] Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

### Variáveis de ambiente
- [ ] `SPRING_DATASOURCE_URL` configurado (Railway fornece via `${{Postgres.PGHOST}}`)
- [ ] `SPRING_DATASOURCE_USERNAME` configurado
- [ ] `SPRING_DATASOURCE_PASSWORD` configurado
- [ ] `JWT_SECRET` gerado (mínimo 256 bits — use `openssl rand -base64 64`)
- [ ] `JWT_EXPIRATION_MS` definido (ex: 600000)
- [ ] `JWT_REFRESH_TOKEN_EXPIRATION_MS` definido (ex: 604800000)
- [ ] `SPRING_JPA_HIBERNATE_DDL_AUTO` definido como `update`

### Deploy
- [ ] Deploy iniciado com sucesso
- [ ] Build completo sem erros
- [ ] Aplicação rodando (status "Running")
- [ ] URL pública copiada (ex: `https://seu-backend.up.railway.app`)

### Testes pós-deploy
- [ ] Acesso à URL pública retorna resposta (mesmo que erro 401/405 é OK)
- [ ] Logs do Railway não mostram erros de conexão com banco
- [ ] Endpoint `/auth/register` acessível

---

## 🌐 Frontend (Vercel)

### Setup inicial
- [ ] Importado repositório GitHub na Vercel
- [ ] Framework detectado como Next.js

### Configuração do projeto
- [ ] Root Directory definido como `frontend`
- [ ] Build Command: `npm run build` (padrão)
- [ ] Output Directory: `.next` (padrão)
- [ ] Install Command: `npm install` (padrão)

### Variáveis de ambiente
- [ ] `NEXT_PUBLIC_API_URL` adicionado (URL do backend Railway)
- [ ] Variável marcada para **Production**
- [ ] Variável marcada para **Preview**
- [ ] Variável marcada para **Development** (opcional)

### Deploy
- [ ] Deploy iniciado com sucesso
- [ ] Build completo sem erros TypeScript/ESLint
- [ ] URL de produção gerada (ex: `https://library-mindxandria.vercel.app`)

### Testes pós-deploy
- [ ] Site carrega corretamente
- [ ] Página de login acessível
- [ ] Página de registro acessível
- [ ] Console do navegador sem erros de CORS
- [ ] Possível criar conta de teste
- [ ] Possível fazer login com conta criada
- [ ] Dashboard exibe corretamente após login
- [ ] Logout funciona

---

## 🔍 Validações finais

### Segurança
- [ ] `JWT_SECRET` nunca foi commitado no Git
- [ ] Credenciais do banco não estão expostas no código
- [ ] CORS configurado apenas para origens necessárias
- [ ] HTTPS ativo em ambos frontend e backend

### Performance
- [ ] Lighthouse score > 80 (opcional)
- [ ] Primeira carga < 3s
- [ ] API responde em < 500ms

### Funcionalidades
- [ ] Registro de novo usuário funciona
- [ ] Login retorna tokens válidos
- [ ] Refresh token funciona
- [ ] CRUD de livros funciona (se implementado)
- [ ] Logout limpa tokens corretamente

### Documentação
- [ ] README.md atualizado com URLs de produção
- [ ] Variáveis de ambiente documentadas
- [ ] Guia de deploy está completo

---

## 🐛 Troubleshooting comum

### Erro: "CORS policy"
✅ **Solução**: 
- Verifique se `NEXT_PUBLIC_API_URL` está correto na Vercel
- Confirme que o backend permite `https://*.vercel.app` (já configurado)
- Force redeploy no Railway se mudou CORS recentemente

### Erro: "Network Error" ou "Failed to fetch"
✅ **Solução**:
- Confirme que backend está rodando (Railway dashboard → status)
- Teste URL do backend diretamente no navegador
- Verifique logs do Railway para erros

### Erro: "Database connection failed"
✅ **Solução**:
- Verifique variáveis de ambiente no Railway
- Confirme que PostgreSQL está rodando
- Teste conexão usando Railway CLI ou dashboard

### Erro: "Invalid JWT"
✅ **Solução**:
- Confirme que `JWT_SECRET` é o mesmo em todas instâncias
- Limpe localStorage do navegador
- Faça novo login

---

## 📊 Monitoramento pós-deploy

- [ ] Configurado alertas no Railway (opcional)
- [ ] Configurado analytics na Vercel (opcional)
- [ ] Configurado Sentry para error tracking (opcional)
- [ ] Backup automático do PostgreSQL (Railway Pro)

---

## ✨ Próximos passos (opcional)

- [ ] Configurar domínio customizado na Vercel
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar testes automatizados
- [ ] Configurar staging environment
- [ ] Implementar rate limiting
- [ ] Adicionar logs estruturados

---

**Data do último deploy**: ___________  
**Versão deployada**: ___________  
**Responsável**: ___________  

---

## 🎉 Deploy completo!

Se todos os checkboxes acima estão marcados, seu deploy está completo e funcional. 

Compartilhe a URL com seus usuários: `https://library-mindxandria.vercel.app`

Problemas? Consulte:
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
