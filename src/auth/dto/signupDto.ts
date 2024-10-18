import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class SignupDto {
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
  readonly role: "SUPER_ADMIN" | "ADMIN" | "TECHNICIEN" | "CLIENT"
  }