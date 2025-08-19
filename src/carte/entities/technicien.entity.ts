import { ApiProperty } from '@nestjs/swagger';

export class TechnicienEntity {
  @ApiProperty({ example: 'tech_123' })
  id: string;

  @ApiProperty({ example: 'Dupont' })
  nom: string;

  @ApiProperty({ example: 'Jean' })
  prenom: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  email: string;
}
