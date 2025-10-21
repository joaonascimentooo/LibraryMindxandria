# Root-level Dockerfile to build backend from monorepo
# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy Maven wrapper and pom for dependency caching
COPY backend/pom.xml backend/mvnw backend/.mvn/ ./backend/

# Ensure wrapper is executable (no-op on Windows)
RUN chmod +x backend/mvnw || true

# Download dependencies
RUN ./backend/mvnw -f backend/pom.xml dependency:go-offline -B

# Copy source and build
COPY backend/src ./backend/src
RUN ./backend/mvnw -f backend/pom.xml clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar
COPY --from=build /workspace/backend/target/backend-*.jar app.jar

# The platform (Railway) will set PORT; default to 8080 locally
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# Start app
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
