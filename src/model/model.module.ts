import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
