import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ForfaitService } from './forfait.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from 'express';

@Controller('forfait')
export class ForfaitController {
  constructor(private readonly forfaitService: ForfaitService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @Get('/')
    getForfait() {
      return this.forfaitService.getForfait()
    }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @Post('/create')
    createForfait(@Body() createForfaitDto: CreateForfaitDto) {
      return this.forfaitService.createForfait(createForfaitDto)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @Put('/update/:id')
    updateForfait(@Req() request: Request) {
      return this.forfaitService.updateForfait(request)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @Delete('/delete/:id')
    deleteForfait(@Req() request: Request) {
      return this.forfaitService.deleteForfait(request)
    }
}
