import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class BulkCreateEmptyInterventionsDto {
  @ApiProperty({
    description: 'ID du technicien',
    example: 'cm4xkj8p90001xyz123abc456',
  })
  @IsString()
  technicien_id: string;

  @ApiProperty({
    description: 'ID de la zone',
    example: 'cm4xkj8p90002xyz789def012',
  })
  @IsString()
  zone_id: string;

  @ApiProperty({
    description: 'Date de début (YYYY-MM-DD)',
    example: '2025-08-10',
  })
  @IsDateString()
  date_debut: string;

  @ApiProperty({
    description: 'Date de fin (YYYY-MM-DD)',
    example: '2025-09-20',
  })
  @IsDateString()
  date_fin: string;

  @ApiPropertyOptional({
    description: 'Heure de début de la journée (0-23)',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  heure_debut?: number = 8;

  @ApiPropertyOptional({ description: 'Minute de début (0-59)', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minute_debut?: number = 0;

  @ApiPropertyOptional({
    description: 'Heure de fin de la journée (1-23)',
    example: 18,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(23)
  heure_fin?: number = 18;

  @ApiPropertyOptional({ description: 'Minute de fin (0-59)', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minute_fin?: number = 0;

  @ApiPropertyOptional({
    description: 'Durée des créneaux en minutes',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(480)
  duree_minutes?: number = 60;
}

export class BulkCreateEmptyInterventionsResponseDto {
  @ApiProperty({ description: 'Nombre de créneaux créés', example: 22 })
  createdCount: number;

  @ApiProperty({
    description: 'Nombre de créneaux ignorés (chevauchement/existants)',
    example: 5,
  })
  skippedCount: number;

  @ApiProperty({
    description: 'Identifiants des interventions créées',
    type: [String],
  })
  createdIds: string[];
}
