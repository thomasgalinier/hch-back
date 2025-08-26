import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListPlannedInterventionsQueryDto {
  @ApiPropertyOptional({
    description:
      'Jour calendaire au format ISO (YYYY-MM-DD) en Europe/Paris. Si omis, retourne toutes les UNPLANNED.',

    example: '2025-08-24',
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  jour?: string; // YYYY-MM-DD

  @ApiPropertyOptional({
    description: 'ID de la zone',
    example: 'zone-123',
  })
  @IsOptional()
  @IsString()
  zone_id?: string;

  @ApiPropertyOptional({
    description: 'ID du technicien',
    example: 'technicien-123',
  })
  @IsOptional()
  @IsString()
  technicien_id?: string;
}

