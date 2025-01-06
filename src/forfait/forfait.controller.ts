import { Controller, Get } from '@nestjs/common';
import { ForfaitService } from './forfait.service';

@Controller('forfait')
export class ForfaitController {
  constructor(private readonly forfaitService: ForfaitService) { }
    @Get('/')
    getForfait() {
      return this.forfaitService.getForfait()
    }

}
