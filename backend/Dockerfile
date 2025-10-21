# Multi-stage build para otimizar imagem
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro (cache layer)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Baixar dependências (será cacheado se pom.xml não mudar)
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Build do projeto (pula testes para acelerar)
RUN ./mvnw clean package -DskipTests

# Imagem final menor
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar apenas o JAR da etapa de build
COPY --from=build /app/target/backend-*.jar app.jar

# Expor porta 8080 (Railway/Render detectam automaticamente)
EXPOSE 8080

# Variáveis de ambiente padrão (podem ser sobrescritas)
ENV SPRING_PROFILES_ACTIVE=prod

# Executar a aplicação
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
