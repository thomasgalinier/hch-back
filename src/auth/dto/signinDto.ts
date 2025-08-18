import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SigninDto {
  @IsEmail()
  @ApiProperty({ example: 'jane.doe@example.com' })
  readonly email: string
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret123!' })
  readonly password: string
}