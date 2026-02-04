FROM node:20-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libopus0 \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js .

EXPOSE 8080

USER node

CMD ["node", "server.js"]
