import { IsNotEmpty } from 'class-validator';

export class PlanningDto {
  @IsNotEmpty()
  readonly id_technicien: string;
  @IsNotEmpty()
  readonly id_model: string;
  @IsNotEmpty()
  readonly dateTime: Date
}