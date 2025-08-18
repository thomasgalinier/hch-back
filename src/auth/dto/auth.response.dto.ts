import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SignupResponseDto {
  @ApiProperty({ description: 'JWT à utiliser en Authorization: Bearer <token>', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class SigninResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Déconnexion réussie' })
  message: string;
}
