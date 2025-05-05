Moodmate Backend
=====

## 시작하는 법(작성중)
```
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


- core
    - login
    - chat
    - diary
        - 

    - components
    - domain
- di
    - DatabaseConfig
    - LLMConfig
- infra
    - postgres connection
    - google oauth connection



login
- google login
- (최초 로그인 시) 구글에서 개인정보 받아온 것 수정

diary
- diary는 어떤 개념?
    - 사용자가 입력한 데이터
    - 분석 결과 (AI)
    - 날짜
- 월별 일기 가져오기
- 일별 일기 가져오기
- 일기 작성
    - 작성함 동시에 분석 과정까지 다 돌려야됨
- 일기 삭제

chat
- 특정 날짜와 연결된 “chat” 이라는 개념이 있어야됨
    - 어떤 일기로 생성된 chat인지
    - 어떤 메세지들이 해당 chat에서 오고갔는지
- 채팅 입력
    - 메모리 업데이트 및 채팅 내용 저장
    - AI 응답 반환


in some point, controller is the usecase in api system. so it can be main logic connecting abstract components.



https://do5do.tistory.com/20