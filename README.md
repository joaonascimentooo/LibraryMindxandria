# LibraryMindxandria 📚

Sistema de gerenciamento de biblioteca digital com autenticação JWT, desenvolvido com Spring Boot e Next.js.

## 🚀 Tecnologias

### Backend
- **Java 21** com Spring Boot 3.x
- **PostgreSQL** para persistência de dados
- **Spring Security** com autenticação JWT
- **Spring Data JPA** para ORM
- **Lombok** para redução de boilerplate

### Frontend
- **Next.js 15** com App Router
- **React 19** com TypeScript
- **TailwindCSS 4** para estilização
- **Sistema de autenticação** com JWT

## 📋 Pré-requisitos

- Java 21+
- Node.js 20+
- PostgreSQL 15+
- Maven 3.9+ (ou use o wrapper incluído)

## ⚙️ Configuração

### 1. Banco de Dados

Crie um banco PostgreSQL:

```sql
CREATE DATABASE librarydb;
```

### 2. Backend

Copie o arquivo de exemplo e configure:

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edite `application.properties` com suas credenciais:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/librarydb
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

jwt.secret=sua_chave_secreta_aqui_minimo_256_bits
jwt.expiration-ms=600000
jwt.refresh-token.expiration-ms=604800000
```

**Importante**: Gere uma chave JWT segura com:
```bash
openssl rand -base64 64
```

### 3. Frontend

Crie o arquivo `.env.local`:

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
```

## 🏃 Executando o Projeto

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

O servidor estará rodando em `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
LibraryMindxandria/
├── backend/
│   └── src/main/java/com/librarymindxandria/backend/
│       ├── controllers/      # Endpoints REST
│       ├── services/         # Lógica de negócio
│       ├── repositories/     # Acesso a dados
│       ├── models/           # Entidades JPA
│       ├── dtos/             # Data Transfer Objects
│       └── core/
│           └── security/     # Configuração JWT e Spring Security
└── frontend/
    └── src/
        ├── app/              # Rotas Next.js (App Router)
        ├── components/       # Componentes React
        ├── hooks/            # Custom hooks
        └── lib/              # Utilitários e helpers
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) com:
- **Access Token**: Expira em 10 minutos
- **Refresh Token**: Expira em 7 dias

### Endpoints de Autenticação

- `POST /auth/register` - Criar nova conta
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token

## 🛡️ Segurança

- Senhas criptografadas com BCrypt
- CORS configurado para o frontend
- Tokens JWT com expiração
- Validação de dados com Bean Validation

## 📝 Funcionalidades

- ✅ Cadastro de usuários
- ✅ Login/Logout
- ✅ Perfil de usuário no header
- ✅ Refresh token automático
- 🚧 Gerenciamento de livros (em desenvolvimento)
- 🚧 Upload de arquivos (em desenvolvimento)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gerenciamento de bibliotecas digitais.
