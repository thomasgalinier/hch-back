import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientSignupDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe' })
  readonly nom: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'Jane' })
  readonly prenom: string;
  @IsEmail()
  @ApiProperty({ example: 'jane.doe@example.com' })
  readonly email: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'SuperSecret123!' })
  readonly password: string;
  @IsNotEmpty()
  @ApiProperty({ example: '+33601020304' })
  readonly telephone: string;

}
