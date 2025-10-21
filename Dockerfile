# Root-level Dockerfile to build backend from monorepo
# Stage 1: Build with Maven (use Maven from image instead of wrapper)
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy POM first to leverage Docker layer caching
COPY backend/pom.xml ./backend/pom.xml

# Pre-fetch dependencies (no wrapper needed)
RUN mvn -f backend/pom.xml dependency:go-offline -B

# Copy the source and build
COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests

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
