 import { ApiProperty } from '@nestjs/swagger';

export class DeleteInterventionResponseDto {
  @ApiProperty({ description: "ID de l'intervention supprimée", example: 'cm4xkj8p90005xyz567mno890' })
  id: string;

  @ApiProperty({ description: 'Indique si la suppression a réussi', example: true })
  deleted: boolean;

  @ApiProperty({ description: 'Nombre de lignes Forfait_Intervention supprimées', example: 1 })
  deletedForfaitsCount: number;
}
