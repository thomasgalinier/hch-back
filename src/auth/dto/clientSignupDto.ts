import { IsNotEmpty, IsEmail } from "class-validator";

export class ClientSignupDto {
  @IsNotEmpty()
  readonly nom: string
  @IsNotEmpty()
  readonly prenom: string
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
  @IsNotEmpty()
  readonly telephone: string
  @IsNotEmpty()
  readonly ville: string
  @IsNotEmpty()
  readonly codePostal: number
  @IsNotEmpty()
  readonly adresse: string
  }