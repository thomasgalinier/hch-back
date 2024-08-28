import { IsNotEmpty, IsEmail } from "class-validator";

export class AdminSignupDto {
  @IsNotEmpty()
  readonly nom: string
  @IsNotEmpty()
  readonly prenom: string
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
  @IsNotEmpty()
  readonly role: string
  readonly entreprise_id: string
  userId: string
}