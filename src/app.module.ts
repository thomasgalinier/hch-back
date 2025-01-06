import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { CarteModule } from "./carte/carte.module";
import { PlaningModule } from './planing/planing.module';
import { ModelController } from './model/model.controller';
import { ModelService } from './model/model.service';
import { ModelModule } from './model/model.module';
import { ForfaitService } from './forfait/forfait.service';
import { ForfaitModule } from './forfait/forfait.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule,CarteModule, PrismaModule, PlaningModule, ModelModule, ForfaitModule],
  controllers: [ModelController],
  providers: [ModelService, ForfaitService],
})
export class AppModule {}
