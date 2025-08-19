import { Module } from '@nestjs/common';
import { ForfaitController } from './forfait.controller';
import { ForfaitService } from './forfait.service';

@Module({
  controllers: [ForfaitController],
  providers: [ForfaitService],
})
export class ForfaitModule {}
