import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GeoJSONPolygonDto {
  @ApiProperty({ example: 'Polygon' })
  type: string;

  @ApiProperty({
    description: 'Coordonnées GeoJSON [ [ [lng, lat], ... ] ]',
    example: [
      [ [2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85] ]
    ]
  })
  coordinates: number[][][];
}

export class CreateZoneDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Zone 1' })
  readonly nom: string;

  @IsNotEmpty()
  @ApiProperty({ type: GeoJSONPolygonDto })
  readonly polygone: GeoJSONPolygonDto;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Identifiant du technicien assigné', nullable: true })
  readonly idTechnicien: string | null;

  @IsNotEmpty()
  @ApiProperty({ example: '#00AAFF' })
  readonly color: string;
}
