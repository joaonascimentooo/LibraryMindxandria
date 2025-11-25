# LibraryMindxandria 📚

Sistema completo de gerenciamento de biblioteca digital com autenticação JWT, upload de PDFs e leitura online, desenvolvido com Spring Boot e Next.js.

## 🚀 Tecnologias

### Backend
- **Java 21** com Spring Boot 3.x
- **PostgreSQL** para persistência de dados
- **Spring Security** com autenticação JWT
- **Spring Data JPA** para ORM
- **Lombok** para redução de boilerplate
- **Sistema de upload de arquivos** com suporte a PDF e imagens

### Frontend
- **Next.js 15** com App Router
- **React 19** com TypeScript
- **TailwindCSS 4** para estilização
- **Framer Motion** para animações suaves
- **Lucide React** para ícones
- **PDF.js** para visualização de PDFs
- **Sistema de autenticação** com JWT e refresh tokens

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
│   ├── src/main/java/com/librarymindxandria/backend/
│   │   ├── controllers/      # Endpoints REST
│   │   ├── services/         # Lógica de negócio
│   │   ├── repositories/     # Acesso a dados
│   │   ├── models/           # Entidades JPA
│   │   ├── dtos/             # Data Transfer Objects
│   │   ├── enums/            # Enumerações (GenreType, TokenType)
│   │   └── core/
│   │       ├── config/       # Configurações gerais
│   │       └── security/     # Configuração JWT e Spring Security
│   └── uploads/              # Arquivos enviados pelos usuários
└── frontend/
    └── src/
        ├── app/              # Rotas Next.js (App Router)
        │   ├── login/        # Página de login
        │   ├── register/     # Página de registro
        │   ├── profile/      # Perfil do usuário
        │   ├── my-books/     # Livros do usuário
        │   ├── search/       # Explorar livros
        │   ├── upload/       # Upload de livros
        │   └── read/         # Leitura de PDFs
        ├── components/       # Componentes React
        │   ├── Header.tsx        # Cabeçalho com navegação
        │   ├── Footer.tsx        # Rodapé
        │   ├── BookCard.tsx      # Card de livro
        │   ├── SearchBar.tsx     # Barra de busca
        │   ├── PDFViewer.tsx     # Visualizador de PDF
        │   ├── SplitText.tsx     # Animação de texto
        │   └── ScrollReveal.tsx  # Animação de scroll
        ├── hooks/            # Custom hooks
        │   ├── useAuth.ts        # Hook de autenticação
        │   └── useTokenRefresh.ts # Hook de refresh token
        └── lib/              # Utilitários e helpers
            ├── api.ts            # Cliente API
            ├── auth.ts           # Funções de autenticação
            ├── fetchWithAuth.ts  # Fetch com autenticação
            └── genres.ts         # Tradução de gêneros
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) com:
- **Access Token**: Expira em 10 minutos
- **Refresh Token**: Expira em 7 dias
- **Renovação automática** de tokens no frontend

### Endpoints de Autenticação

- `POST /auth/register` - Criar nova conta
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token
- `GET /users/me` - Obter perfil do usuário
- `PUT /users/me` - Atualizar perfil
- `DELETE /users/me` - Excluir conta

## 📚 Endpoints de Livros

- `GET /books` - Listar todos os livros (com paginação e filtros)
- `GET /books/{id}` - Obter detalhes de um livro
- `POST /books` - Criar novo livro (requer autenticação)
- `PUT /books/{id}` - Atualizar livro (apenas o autor)
- `DELETE /books/{id}` - Excluir livro (apenas o autor)
- `GET /books/my-books` - Listar livros do usuário autenticado

## 📁 Upload de Arquivos

- `POST /upload` - Upload de arquivo (PDF ou imagem)
- `GET /upload/{filename}` - Download de arquivo
- Suporte a múltiplos formatos: PDF, PNG, JPG, JPEG, GIF
- Validação de tamanho e tipo de arquivo

## 🛡️ Segurança

- Senhas criptografadas com BCrypt
- CORS configurado para o frontend
- Tokens JWT com expiração
- Validação de dados com Bean Validation
- Autenticação baseada em roles (USER, ADMIN)
- Proteção de rotas sensíveis

## 🎨 Design e UX

- **Tema burgundy/vinho** com detalhes em ouro (#3d1f1f, #c9a961)
- **Animações suaves** com Framer Motion:
  - SplitText: Animação palavra por palavra
  - ScrollReveal: Elementos aparecem ao scrollar
  - Transições de página e componentes
- **Ícones profissionais** do Lucide React
- **Responsivo** para todos os dispositivos
- **Leitura de PDF integrada** com navegação por páginas

## 📝 Funcionalidades

### ✅ Autenticação e Perfil
- Cadastro de usuários com validação
- Login/Logout com JWT
- Perfil de usuário editável
- Refresh token automático
- Exclusão de conta

### ✅ Gerenciamento de Livros
- Upload de livros (PDF + capa)
- Listagem com filtros por gênero e termo de busca
- Paginação de resultados
- Edição de livros (título, descrições)
- Exclusão de livros
- Visualização de livros do usuário

### ✅ Leitura
- Visualizador de PDF integrado
- Navegação por páginas
- Controles de zoom
- Modo de tela cheia
- Proteção de conteúdo

### ✅ Busca e Exploração
- Busca por título
- Filtros por gênero (20+ categorias)
- Paginação
- Cards com animações

### 🎭 Gêneros Suportados

Romance, Ficção Científica, Fantasia, Mistério, Suspense, Terror, Biografia, Autobiografia, História, Filosofia, Psicologia, Autoajuda, Desenvolvimento Pessoal, Negócios, Tecnologia, Ciência, Poesia, Drama, Comédia, Aventura, e mais!

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
