# Moodmate
A diary web application leveraging LLMs to analyze emotions and interact with users based on their diaries.  
  
<img width="620" alt="Extracted knowledge" src="https://github.com/user-attachments/assets/f66595c6-1d97-4b5f-8f94-12677c5d38e6" />  
  
## Project structure
<img width="620" alt="Big picture" src="https://github.com/user-attachments/assets/6981488e-e59b-4225-beec-4ee69e66d7f8" />  
  
This repository contains the following components
- frontend: React web app
- backend: Spring Boot REST API application
- ai-api: REST API application for LLM and knowledge base interactions
- helm-chart: Helm chart for the project except knowledge base
  

You can find the knowledge base application repository [here](https://github.com/rst0070/knowledge-base).  
  
## Infrastructure
<img width="650" alt="Infra setting" src="https://github.com/user-attachments/assets/8b0e2543-b087-434f-82c1-1e1f00d392c2" />  
  
- AWS EKS cluster is used for deploying frontend, backend, and database
- Self-hosted Infisical is used for injecting environment variables to applications
- GitHub Actions is used for building and pushing Docker images to self-hosted Harbor registry
  
## Screenshots
__Dashboard__  
<img width="650" alt="Dashboard" src="https://github.com/user-attachments/assets/c4d24966-4baa-4916-986d-331e11c7c7cb" />  
  
__Calendar__  
<img width="650" alt="Calendar" src="https://github.com/user-attachments/assets/4e14edb4-9ff9-425b-8611-c64cd1c5367a" />  
  
__Diary__  
<img width="650" alt="Add diary" src="https://github.com/user-attachments/assets/e86e52bb-adcf-4ea0-b26b-260367a3bd2e" />  
<img width="650" alt="diary result" src="https://github.com/user-attachments/assets/f1954648-2dd5-465a-9ed7-6357ca4e99cd" />  
  
__Chat__  
<img width="650" alt="chat" src="https://github.com/user-attachments/assets/e50387cf-d8cc-40b7-9504-33f0faa88a2b" />  
  
__Emotion history__  
<img width="650" alt="history" src="https://github.com/user-attachments/assets/aa7048eb-f94a-41fe-8844-49baf9967d54" />
