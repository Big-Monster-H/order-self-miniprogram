# ==========================================
#  server/Dockerfile — 后端生产镜像
# ==========================================
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist/ ./dist/
COPY .env ./
RUN mkdir -p uploads
EXPOSE {SERVER_PORT}
CMD ["node", "dist/main.js"]