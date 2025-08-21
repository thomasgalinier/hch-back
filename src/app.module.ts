import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CarteModule } from './carte/carte.module';
import { ForfaitService } from './forfait/forfait.service';
import { SuperAdminBootstrapService } from './bootstrap/super-admin.bootstrap'; // Crée un SUPER_ADMIN au démarrage si besoin
import { ForfaitModule } from './forfait/forfait.module';
import { TestModule } from './test/test.module';
import { InterventionModule } from './intervention/intervention.module';

@Module({
  imports: [
    // Load .env.local first if present (for local dev), then fallback to .env (Docker/default)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    CarteModule,
    PrismaModule,
    ForfaitModule,
    TestModule,
    InterventionModule,
  ],
  controllers: [],
  providers: [ForfaitService, SuperAdminBootstrapService],
})
export class AppModule {}
