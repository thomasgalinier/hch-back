import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InterventionService } from './intervention.service';

@Injectable()
export class InterventionCron {
  private readonly logger = new Logger(InterventionCron.name);

  constructor(
    private readonly interventionService: InterventionService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'auto-start-planned',
    timeZone: 'Europe/Paris',
  })
  async autoStartPlannedEveryMinute() {
    try {
      const { updatedCount } =
        await this.interventionService.autoStartPlannedNow();
      this.logger.log(
        `Auto-start: ${updatedCount} intervention(s) -> IN_PROGRESS`,
      );
    } catch (e) {
      this.logger.error('Erreur auto-start interventions', e as any);
    }
  }

  onModuleInit() {
    const crons = this.schedulerRegistry.getCronJobs();
    console.log('[DEBUG] Cron jobs enregistrés:', Array.from(crons.keys()));
  }
}
