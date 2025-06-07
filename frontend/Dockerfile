FROM node:24-slim

# install infisical cli
RUN apt-get update && apt-get install -y \
    curl \
    && curl -1sLf 'https://artifacts-cli.infisical.com/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app
COPY . .
RUN npm install --silent

EXPOSE 3000

CMD infisical run \
    --token="${INFISICAL_TOKEN}" \
    --env="${INFISICAL_ENVIRONMENT}" \
    --projectId="${INFISICAL_PROJECT_ID}" \
    --domain="${INFISICAL_HOST}" \
    -- \
    npm run start