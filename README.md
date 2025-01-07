```bash
npm install
```

```bash
cd docker && docker-compose up -d
cd .. 
touch .env
```
copier coller ce contenue dans le .env
```text
DATABASE_URL="postgresql://admin:admin@localhost:5432/hch?schema=public"
SECRET_KEY= "SECRET_KEY"
```
```bash
npx prisma migrate dev
```
```bash
npm run dev
```
crée un super admin
```bash
curl -X POST http://localhost:8081/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "nom": "admin",
  "prenom": "admin", 
  "email": "admin@admin.com",
  "password": "admin",
  "telephone": "0466480897",
  "role": "SUPER_ADMIN"
}'

```