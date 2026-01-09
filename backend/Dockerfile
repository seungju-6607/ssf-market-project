# ===============================
# 1단계: Gradle로 Spring Boot 빌드
# ===============================
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# 현재 backend 폴더 전체 복사
COPY . .

# 테스트는 생략하고 빌드 (무료 서버 안정용)
RUN gradle build -x test


# ===============================
# 2단계: 실행용 경량 이미지
# ===============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# 빌드된 jar 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# Spring Boot 기본 포트
EXPOSE 8080

# 서버 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
