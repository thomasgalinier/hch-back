import { IsNotEmpty, IsEmail } from "class-validator";

export class TechnicienSigninDto {
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
}