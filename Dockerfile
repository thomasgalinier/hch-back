# === BUILD STAGE ===
FROM node:18-alpine as build
WORKDIR /app

ARG DATBASE_URL
ENV DATABASE_URL=${DATBASE_URL}

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy

# === FINAL STAGE ===
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/prisma ./prisma

CMD ["node", "dist/src/main.js"]
