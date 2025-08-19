import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInterventionDto {
  @ApiProperty({
    description: "Date et heure de début de l'intervention",
    example: '2025-08-06T14:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  debut: string;

  @ApiProperty({
    description: "Date et heure de fin de l'intervention",
    example: '2025-08-06T16:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  fin: string;

  @ApiProperty({
    description: "Adresse où aura lieu l'intervention",
    example: '123 Rue de la Paix, 75001 Paris',
  })
  @IsString()
  adresse: string;

  @ApiProperty({
    description: "ID du client qui demande l'intervention",
    example: 'cm4xkj8p90001xyz123abc456',
  })
  @IsString()
  client_id: string;

  @ApiProperty({
    description: "ID de la zone où se déroule l'intervention",
    example: 'cm4xkj8p90002xyz789def012',
  })
  @IsString()
  zone_id: string;

  @ApiProperty({
    description: "ID du forfait sélectionné pour l'intervention",
    example: 'cm4xkj8p90003xyz345ghi678',
  })
  @IsString()
  forfait_id: string;

  @ApiPropertyOptional({
    description: "Détails supplémentaires sur l'intervention",
    example: 'Réparation urgente - client disponible toute la journée',
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({
    description: 'Informations sur le vélo (marque, modèle, couleur, etc.)',
    example: 'VTT Giant rouge, modèle 2023, 26 pouces',
  })
  @IsOptional()
  @IsString()
  info_velo?: string;

  @ApiPropertyOptional({
    description: 'Description du problème rencontré',
    example: 'Frein arrière ne fonctionne plus, bruit étrange au pédalage',
  })
  @IsOptional()
  @IsString()
  probleme?: string;
}
