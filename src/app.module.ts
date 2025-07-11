import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { CarteModule } from "./carte/carte.module";
import { ForfaitService } from './forfait/forfait.service';
import { ForfaitModule } from './forfait/forfait.module';
import { ProduitModule } from './produit/produit.module';
import { InterventionModule } from './intervention/intervention.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule,CarteModule, PrismaModule, ForfaitModule, ProduitModule, InterventionModule, TestModule],
  controllers: [],
  providers: [ForfaitService],
})
export class AppModule {}
