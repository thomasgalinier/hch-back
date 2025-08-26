# === BUILD STAGE ===
FROM node:20-alpine AS build
WORKDIR /app

# Déps système nécessaires à Prisma sur Alpine
RUN apk add --no-cache libc6-compat openssl

# Installer deps
COPY package*.json ./
RUN npm ci

# Copier le code
COPY . .

# Générer Prisma Client avant build TS
RUN npx prisma generate

# Compiler (assure-toi que tsconfig "outDir" = "dist")
RUN npm run build

# === RUNTIME STAGE ===
FROM node:20-alpine AS runtime
WORKDIR /app

# Déps système nécessaires à Prisma
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production

# Copier juste ce qui est nécessaire
COPY package*.json ./
RUN npm ci --omit=dev

# Prisma client et binaires (si générés côté build)
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Code compilé + schémas
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# (Optionnel) Migrer au démarrage puis lancer l'app
# CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/main.js"]
CMD ["node", "dist/src/main.js"]