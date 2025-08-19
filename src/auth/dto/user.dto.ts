import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '12345', description: "Identifiant de l'utilisateur" })
  id: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'Doe' })
  nom: string;

  @ApiProperty({ example: 'Jane' })
  prenom: string;

  @ApiProperty({ example: '+33601020304' })
  telephone: string;

  @ApiProperty({ example: 'TECHNICIEN', enum: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIEN', 'CLIENT'] })
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'TECHNICIEN' | 'CLIENT';
}
