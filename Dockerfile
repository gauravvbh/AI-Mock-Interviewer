FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY .env.local .env.local
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
