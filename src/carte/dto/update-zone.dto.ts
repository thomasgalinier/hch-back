import { PartialType } from '@nestjs/swagger';
import { CreateZoneDto } from './createZoneDto';

export class UpdateZoneDto extends PartialType(CreateZoneDto) {}
