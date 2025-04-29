Moodmate Backend
=====

## 시작하는 법(작성중)

### 로컬환경에서 Spring Boot 테스트 환경 구축

```
docker-compose up --build -d
```

API와 PostgreSQL만 연결되어 있으며, 8080 포트로 API 접근 가능하고 5432 포트로 DB 접속가능

Gradle로 빌드 후 이미지를 교체하거나 다시 명령 사용해 업데이트 가능

### application-oauth.yml 암호화 풀기

매번 pull 받을 때마다 git-crypt-key.txt 파일을 moodmate root에 둔 뒤

```
git-crypt unlock git-crypt-key.txt
```

로 암호화 해제 가능

git-crypt는 https://github.com/AGWA/git-crypt/releases/tag/0.7.0 에서 다운로드 가능

exe 파일을 다운로드한 뒤 명령줄에서 해당 파일을 사용해 실행하면 됨

### 작성중

minikube start
kubectl apply -f {backend}\k8s-settings\postgresql.yaml
kubectl apply -f {backend}\k8s-settings\nginx.yaml
```
* windows 11-docker-minikube 환경에서 실행이 확인됨


```
kubectl get all
```
을 통해 찾은 pod 이름을

```
kubectl port-forward {pod name} {target port}
```
를 통해 포트포워딩하면 로컬 환경에서 127.0.0.1:{target port}로 연결
postgreSQL은 DbVisualizer 등을 사용해 ID: moodmate/ PW: moodmate 로 접속 가능

