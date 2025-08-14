import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInterventionStatusDto {
    @ApiProperty({
        description: 'Nouveau statut de l\'intervention',
        enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        example: 'IN_PROGRESS'
    })
    @IsIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    statut: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

    @ApiProperty({
        description: 'Commentaire optionnel sur le changement de statut',
        example: 'Intervention démarrée - technicien arrivé sur site',
        required: false
    })
    @IsString()
    commentaire?: string;
}
