import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  readonly nom: string;

  @IsNotEmpty()
  readonly polygone: {
    type: string;
    coordinates: [ [number, number] ][]; // On spécifie un tableau de tableaux de coordonnées
  };

  @IsOptional()
  readonly idTechnicien: string | null;

  @IsNotEmpty()
  readonly color: string;
}
