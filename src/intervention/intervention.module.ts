import { Module } from '@nestjs/common';
import { InterventionController } from './intervention.controller';
import { InterventionService } from './intervention.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InterventionCron } from './intervention.cron';

@Module({
  imports: [PrismaModule],
  controllers: [InterventionController],
  providers: [InterventionService, InterventionCron],
})
export class InterventionModule {}
