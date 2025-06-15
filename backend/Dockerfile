FROM node:18-slim

WORKDIR /app

# install unzip (for Prisma) and openssl
RUN apt-get update \
 && apt-get install -y unzip openssl \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

COPY wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh

CMD ["sh","-c","wait-for-it.sh db:5432 -- npx prisma migrate deploy && npm run dev"]
