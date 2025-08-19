import { ApiProperty } from '@nestjs/swagger';
import { TechnicienEntity } from './technicien.entity';

class GeoJSONPolygon {
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

export class ZoneEntity {
  @ApiProperty({ example: 'zone_123' })
  id: string;

  @ApiProperty({ example: 'Zone Paris 1' })
  nom: string;

  @ApiProperty({ type: GeoJSONPolygon })
  polygone: GeoJSONPolygon;

  @ApiProperty({ example: '#FF5733' })
  color: string;

  @ApiProperty({ example: 'tech_123', nullable: true })
  technicien_id?: string | null;

  @ApiProperty({ type: () => TechnicienEntity, nullable: true })
  technicien?: TechnicienEntity | null;
}
