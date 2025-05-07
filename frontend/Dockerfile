FROM node:latest

WORKDIR /app
COPY . .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

EXPOSE 3000

CMD ["npm", "run", "start"]