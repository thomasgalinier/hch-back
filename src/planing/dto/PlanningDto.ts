import { IsNotEmpty } from 'class-validator';

export class PlanningDto {
  @IsNotEmpty()
  readonly id_technicien: string;
  @IsNotEmpty()
  readonly id_model: string;
  @IsNotEmpty()
  readonly debut: Date;
  @IsNotEmpty()
  readonly fin: Date;
}