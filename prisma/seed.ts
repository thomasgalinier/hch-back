// Script de seed Prisma: crée un SUPER_ADMIN si aucun n'existe.
// À utiliser en local/CI après les migrations (prisma migrate deploy),
// basé sur des variables d'environnement pour ne pas hardcoder d'identifiants.
import { PrismaClient, Role } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Lecture des variables d'environnement
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const nom = process.env.SUPERADMIN_LASTNAME || 'Super';
  const prenom = process.env.SUPERADMIN_FIRSTNAME || 'Admin';
  const telephone = process.env.SUPERADMIN_PHONE || '0000000000';

  if (!email || !password) {
    console.error(
      'Missing SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD env vars. Aborting seed.'
    );
    process.exit(1);
  }

  // Si un SUPER_ADMIN existe déjà, on ne fait rien (seed idempotent)
  const existing = await prisma.utilisateur.findFirst({
    where: { role: Role.SUPER_ADMIN },
  });

  if (existing) {
    console.log(`SUPER_ADMIN already exists: ${existing.email}`);
    return;
  }

  // Hash du mot de passe (10 rounds par défaut)
  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.utilisateur.create({
    data: {
      email,
      password: hash,
      nom,
      prenom,
      telephone,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`Created SUPER_ADMIN: ${admin.email}`);
}

// Exécution protégée avec capture d'erreurs et fermeture du client Prisma
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
