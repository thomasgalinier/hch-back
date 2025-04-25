
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
