FROM gradle:jdk21 AS build
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN gradle build --no-daemon -x test
FROM openjdk:21
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
