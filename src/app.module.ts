import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";
import { CarteModule } from "./carte/carte.module";

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule,CarteModule, PrismaModule],
})
export class AppModule {}
