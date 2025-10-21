# Backend — LibraryMindxandria

API Spring Boot para gerenciamento de biblioteca com autenticação JWT.

## Tecnologias

- Java 21
- Spring Boot 3.5.6
- Spring Security + JWT
- PostgreSQL
- JPA/Hibernate

## Desenvolvimento local

1. **Pré-requisitos**
   - JDK 21
   - PostgreSQL rodando (ou Docker)
   - Maven 3.9+

2. **Configurar banco de dados**
   ```bash
   # Criar banco PostgreSQL local
   createdb librarydb
   ```

3. **Configurar variáveis de ambiente**
   
   Copie `src/main/resources/application.properties.example` para `application.properties` e ajuste:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/librarydb
   spring.datasource.username=postgres
   spring.datasource.password=sua-senha
   jwt.secret=seu-secret-forte-aqui
   ```

4. **Rodar aplicação**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   API estará disponível em `http://localhost:8080`

## Endpoints principais

### Autenticação
- `POST /auth/register` — Registrar novo usuário
- `POST /auth/login` — Login (retorna accessToken e refreshToken)
- `POST /auth/refresh` — Renovar token

### Livros (requer autenticação)
- `GET /api/books` — Listar livros
- `POST /api/books` — Criar livro
- `GET /api/books/{id}` — Buscar livro
- `PUT /api/books/{id}` — Atualizar livro
- `DELETE /api/books/{id}` — Deletar livro

## Deploy

Consulte o guia completo em `/DEPLOY_GUIDE.md` na raiz do repositório.

### Railway (recomendado)

```bash
# Railway CLI (opcional)
railway login
railway init
railway up
```

Ou use o dashboard web: [railway.app](https://railway.app)

### Docker

```bash
# Build
docker build -t librarymindxandria-backend .

# Run
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/librarydb \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e JWT_SECRET=seu-secret-aqui \
  librarymindxandria-backend
```

## Testes

```bash
./mvnw test
```

## Build para produção

```bash
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Variáveis de ambiente (produção)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SPRING_DATASOURCE_URL` | URL do PostgreSQL | `jdbc:postgresql://...` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco | `senha123` |
| `JWT_SECRET` | Secret do JWT (256+ bits) | `openssl rand -base64 64` |
| `JWT_EXPIRATION_MS` | Tempo de expiração do access token (ms) | `600000` (10 min) |
| `JWT_REFRESH_TOKEN_EXPIRATION_MS` | Tempo de expiração do refresh token (ms) | `604800000` (7 dias) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Estratégia do Hibernate | `update` (dev) / `validate` (prod) |

## Estrutura do projeto

```
src/main/java/com/librarymindxandria/backend/
├── controllers/       # REST endpoints
├── services/          # Lógica de negócio
├── repositories/      # Acesso ao banco
├── models/            # Entidades JPA
├── dtos/              # Data Transfer Objects
└── core/
    ├── security/      # Configuração de segurança e JWT
    └── config/        # Outras configurações
```

## CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:3000` (desenvolvimento)
- `https://*.vercel.app` (produção Vercel)

Para adicionar outras origens, edite `SecurityConfig.java`.

## Licença

MIT
