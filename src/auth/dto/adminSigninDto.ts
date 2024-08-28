import { IsNotEmpty, IsEmail } from "class-validator";

export class AdminSigninDto {
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
}