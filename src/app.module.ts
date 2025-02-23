import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { CarteModule } from "./carte/carte.module";
import { ForfaitService } from './forfait/forfait.service';
import { ForfaitModule } from './forfait/forfait.module';
import { ProduitModule } from './produit/produit.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule,CarteModule, PrismaModule, ForfaitModule, ProduitModule],
  controllers: [],
  providers: [ForfaitService],
})
export class AppModule {}
