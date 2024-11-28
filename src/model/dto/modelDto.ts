import { IsNotEmpty } from 'class-validator';

export class ModelDto {
  @IsNotEmpty()
  readonly nom: string;
  @IsNotEmpty()
  readonly duree: number;
}