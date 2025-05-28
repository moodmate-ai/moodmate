FROM python:3.13-slim

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-cache --no-root


CMD ["poetry", "run", "uvicorn", "ai_api.main:app", "--host", "0.0.0.0", "--port", "8000"]