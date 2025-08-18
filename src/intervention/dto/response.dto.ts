import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TechnicienDto {
    @ApiProperty({ example: 'cm4xkj8p90001xyz123abc456' })
    id: string;

    @ApiProperty({ example: 'Dupont' })
    nom: string;

    @ApiProperty({ example: 'Jean' })
    prenom: string;

    @ApiProperty({ example: 'jean.dupont@example.com' })
    email: string;

    @ApiProperty({ example: '0123456789' })
    telephone: string;
}

export class ClientDto {
    @ApiProperty({ example: 'cm4xkj8p90001xyz123abc456' })
    id: string;

    @ApiProperty({ example: 'Martin' })
    nom: string;

    @ApiProperty({ example: 'Marie' })
    prenom: string;

    @ApiProperty({ example: 'marie.martin@example.com' })
    email: string;

    @ApiProperty({ example: '0987654321' })
    telephone: string;
}

export class ZoneDto {
    @ApiProperty({ example: 'cm4xkj8p90002xyz789def012' })
    id: string;

    @ApiProperty({ example: 'Paris 15ème' })
    nom: string;

    @ApiProperty({ example: '#FF5733' })
    color: string;
}

export class ForfaitDto {
    @ApiProperty({ example: 'cm4xkj8p90003xyz345ghi678' })
    id: string;

    @ApiProperty({ example: 'Réparation Standard' })
    titre: string;

    @ApiProperty({ example: 45.99 })
    prix: number;

    @ApiProperty({ example: 'Réparation de base incluant vérification générale' })
    description: string;

    @ApiProperty({ example: '1h30' })
    duree: string;

    @ApiProperty({ example: 90 })
    formatted_duree: number;
}

export class ForfaitInterventionDto {
    @ApiProperty({ example: 'cm4xkj8p90004xyz901jkl234' })
    id: string;

    @ApiProperty({ example: 'cm4xkj8p90003xyz345ghi678' })
    id_forfait: string;

    @ApiProperty({ example: 'cm4xkj8p90005xyz567mno890' })
    id_intervention: string;

    @ApiProperty({ example: 45.99, description: 'Prix du forfait au moment T' })
    prix: number;

    @ApiProperty({ example: 90, description: 'Durée du forfait au moment T (en minutes)' })
    duree: number;

    @ApiProperty({ type: ForfaitDto })
    forfait: ForfaitDto;
}

export class InterventionResponseDto {
    @ApiProperty({ example: 'cm4xkj8p90005xyz567mno890' })
    id: string;

    @ApiProperty({ example: '2025-08-06T14:00:00.000Z' })
    debut: string;

    @ApiProperty({ example: '2025-08-06T16:00:00.000Z' })
    fin: string;

    @ApiProperty({ example: '123 Rue de la Paix, 75001 Paris' })
    adresse: string;

    @ApiProperty({ example: 'PLANNED', enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
    statut: string;

    @ApiProperty({ example: 'cm4xkj8p90001xyz123abc456' })
    client_id: string;

    @ApiProperty({ example: 'cm4xkj8p90001xyz123abc456' })
    technicien_id: string;

    @ApiProperty({ example: 'cm4xkj8p90002xyz789def012' })
    zone_id: string;

    @ApiPropertyOptional({ example: 'Détail: Réparation urgente | Vélo: VTT Giant rouge | Problème: Frein arrière défaillant' })
    detail?: string;

    @ApiProperty({ type: ClientDto })
    client: ClientDto;

    @ApiProperty({ type: TechnicienDto })
    technicien: TechnicienDto;

    @ApiProperty({ type: ZoneDto })
    zone: ZoneDto;

    @ApiProperty({ type: ForfaitInterventionDto })
    forfait_intervention: ForfaitInterventionDto;

    @ApiProperty({ example: '2025-08-06T12:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2025-08-06T12:00:00.000Z' })
    updatedAt: string;
}

export class DisponibiliteResponseDto {
    @ApiProperty({ example: true, description: 'Indique si le créneau est disponible' })
    disponible: boolean;

    @ApiPropertyOptional({ type: TechnicienDto, description: 'Technicien disponible (si disponible)' })
    technicien?: TechnicienDto;
}

export class CreneauLibreDto {
    @ApiProperty({ example: '2025-08-06T14:00:00.000Z', description: 'Heure de début du créneau' })
    debut: string;

    @ApiProperty({ example: '2025-08-06T16:00:00.000Z', description: 'Heure de fin du créneau' })
    fin: string;

    @ApiProperty({ type: TechnicienDto })
    technicien: TechnicienDto;
}

export class CreneauxLibresResponseDto {
    @ApiProperty({ type: [CreneauLibreDto], description: 'Liste des créneaux disponibles' })
    creneaux: CreneauLibreDto[];
}
