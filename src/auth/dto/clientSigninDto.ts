import { IsNotEmpty, IsEmail } from "class-validator";

export class ClientSigninDto {
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
}