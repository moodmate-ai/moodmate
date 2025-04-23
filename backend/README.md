Moodmate Backend
=====

## 시작하는 법(작성중)

### 로컬환경에서 Spring Boot 테스트 환경 구축

```
docker-compose up --build -d
```

API와 PostgreSQL만 연결되어 있으며, 8080 포트로 API 접근 가능하고 5432 포트로 DB 접속가능

다시 올릴 때 docker에서 image를 지울 필요 있음(수정예정)


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

