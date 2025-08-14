import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForfaitDto {
  @ApiProperty({
    description: 'Titre du forfait',
    example: 'Forfait Hebdomadaire Standard',
    type: 'string'
  })
  @IsNotEmpty()
  readonly titre: string;

  @ApiProperty({
    description: 'Prix du forfait en euros (format string, sera converti en nombre)',
    example: '29.99',
    type: 'string'
  })
  @IsNotEmpty()
  readonly prix: string;

  @ApiProperty({
    description: 'Description détaillée du forfait',
    example: 'Accès illimité aux vélos de la catégorie standard pour une durée d\'une semaine',
    type: 'string'
  })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'Type de forfait',
    example: 'PREMIUM',
    type: 'string'
  })
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({
    description: 'Catégorie de vélo concernée par le forfait',
    example: 'STANDARD',
    type: 'string'
  })
  @IsNotEmpty()
  readonly categorie_velo: string;

  @ApiProperty({
    description: 'Durée du forfait (format lisible)',
    example: '7 jours',
    type: 'string'
  })
  @IsNotEmpty()
  readonly duree: string;
}