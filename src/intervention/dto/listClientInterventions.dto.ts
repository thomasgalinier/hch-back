import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { InterventionResponseDto } from './response.dto';

export class ListClientInterventionsQueryDto {
  @ApiPropertyOptional({ description: 'Numéro de page', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Taille de page (nombre de résultats par page)',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginatedInterventionsMetaDto {
  @ApiPropertyOptional()
  page!: number;

  @ApiPropertyOptional()
  limit!: number;

  @ApiPropertyOptional({ description: 'Nombre total de résultats' })
  total!: number;

  @ApiPropertyOptional({ description: 'Nombre total de pages' })
  totalPages!: number;
}

export class PaginatedInterventionsResponseDto {
  
  data!: InterventionResponseDto[];

  meta!: PaginatedInterventionsMetaDto;
}
