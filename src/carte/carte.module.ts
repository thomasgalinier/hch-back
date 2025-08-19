import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CarteController } from './carte.controller';
import { CarteService } from './carte.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CarteController],
  providers: [CarteService],
})
export class CarteModule {}
