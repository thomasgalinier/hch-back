import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { CarteModule } from "./carte/carte.module";
import { ForfaitService } from './forfait/forfait.service';
import { ForfaitModule } from './forfait/forfait.module';
import { TestModule } from './test/test.module';
import { InterventionModule } from './intervention/intervention.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule,CarteModule, PrismaModule, ForfaitModule, TestModule, InterventionModule],
  controllers: [],
  providers: [ForfaitService],
})
export class AppModule {}
