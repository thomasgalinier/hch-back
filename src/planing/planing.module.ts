import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlaningController } from './planing.controller';
import { PlaningService } from './planing.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PlaningController],
  providers: [PlaningService],
})
export class PlaningModule {}