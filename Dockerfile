# === BUILD STAGE ===
FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Génère Prisma Client avant la compilation Nest (tsc n'a pas besoin de prisma/seed.ts)
RUN npx prisma generate
RUN npm run build

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
