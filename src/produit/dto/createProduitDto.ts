import { IsNotEmpty } from 'class-validator';

export class CreateProduitDto {
  @IsNotEmpty()
  readonly nom: string;
  @IsNotEmpty()
  quantite: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  prix: number;

  @IsNotEmpty()
  categorie: string;
}