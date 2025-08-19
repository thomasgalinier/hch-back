import { ApiProperty } from '@nestjs/swagger';

export class AssignTechnicianDto {
    @ApiProperty({ description: 'Identifiant du technicien à assigner', example: 'tech_123' })
    technicienId: string;
}