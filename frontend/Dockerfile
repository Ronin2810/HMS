FROM node:18-slim
WORKDIR /app

# Copy both package files and use npm ci to install exactly what’s locked
COPY package.json package-lock.json ./
RUN npm ci  

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
