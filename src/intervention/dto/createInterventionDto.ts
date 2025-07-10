import { IsNotEmpty } from 'class-validator';

export class CreateInterventionDto {
  @IsNotEmpty()
  readonly debut: Date;
  @IsNotEmpty()
  readonly fin: Date;
  
  @IsNotEmpty()
  readonly adresse: string;

  readonly detail: string;

  @IsNotEmpty()
  readonly statut: string;

  @IsNotEmpty()
  readonly client_id: string;

  @IsNotEmpty()
  readonly technicien_id: string;

  @IsNotEmpty()
  readonly forfait_id: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  readonly zone_id: string;
}