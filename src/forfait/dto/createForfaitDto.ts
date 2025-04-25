import { IsNotEmpty } from 'class-validator';

export class CreateForfaitDto {
  @IsNotEmpty()
  readonly titre: string;

  @IsNotEmpty()
  readonly prix: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly categorie_velo: string;

  @IsNotEmpty()
  readonly duree: string;
}