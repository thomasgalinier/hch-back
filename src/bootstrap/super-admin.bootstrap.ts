// Service de bootstrap: vérifie au démarrage s'il existe un SUPER_ADMIN.
// Si aucun n'existe, il en crée un à partir des variables d'environnement.
// Idempotent: ne crée rien si un SUPER_ADMIN est déjà présent.
import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // Vérifie la présence d'au moins un SUPER_ADMIN
      const existing = await this.prisma.utilisateur.findFirst({
        where: { role: 'SUPER_ADMIN' },
        select: { id: true, email: true },
      });

      if (existing) {
        this.logger.log(`SUPER_ADMIN already present: ${existing.email}`);
        return;
      }

      // Récupération des credentials du super admin via variables d'environnement
      const email = this.config.get<string>('SUPERADMIN_EMAIL');
      const password = this.config.get<string>('SUPERADMIN_PASSWORD');
      const nom = this.config.get<string>('SUPERADMIN_LASTNAME') || 'Super';
      const prenom = this.config.get<string>('SUPERADMIN_FIRSTNAME') || 'Admin';
      const telephone =
        this.config.get<string>('SUPERADMIN_PHONE') || '0000000000';

      if (!email || !password) {
        this.logger.warn(
          'No SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD provided. Skipping SUPER_ADMIN bootstrap.',
        );
        return;
      }

      // Hash du mot de passe (10 rounds par défaut)
      const hash = await bcrypt.hash(password, 10);
      const admin = await this.prisma.utilisateur.create({
        data: {
          email,
          password: hash,
          nom,
          prenom,
          telephone,
          role: 'SUPER_ADMIN',
        },
        select: { id: true, email: true },
      });
      this.logger.log(`Created SUPER_ADMIN: ${admin.email}`);
    } catch (e) {
      this.logger.error('Failed to bootstrap SUPER_ADMIN', e as any);
    }
  }
}
