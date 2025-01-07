```bash
npm install
```

```bash
cd docker && docker-compose up -d
cd .. && npm run dev
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