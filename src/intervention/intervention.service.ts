import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInterventionDto } from './dto/updateIntervention.dto';
import { BulkCreateEmptyInterventionsDto } from './dto/bulkCreateEmptyInterventions.dto';
import { DeleteInterventionsRangeDto } from './dto/deleteInterventionsRange.dto';
import { DeleteInterventionResponseDto } from './dto/deleteIntervention.dto';
import { ListUnplannedInterventionsQueryDto } from './dto/listUnplannedInterventions.dto';
import { ListPlannedInterventionsQueryDto } from './dto/listPlannedInterventionsQuery.dto';
import { ListClientInterventionsQueryDto } from './dto/listClientInterventions.dto';

@Injectable()
export class InterventionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupère toutes les interventions d'un technicien (avec client, zone et forfaits)
   */
  async findAllByTechnicien(technicien_id: string) {
    // Vérifier l'existence du technicien
    const technicien = await this.prisma.utilisateur.findFirst({
      where: { id: technicien_id, role: 'TECHNICIEN' },
      select: { id: true },
    });
    if (!technicien) {
      throw new NotFoundException('Technicien introuvable');
    }

    const interventions = await this.prisma.intervention.findMany({
      where: { technicien_id },
      orderBy: { debut: 'asc' },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        technicien: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        zone: { select: { id: true, nom: true, color: true } },
        forfait_interventions: {
          include: {
            forfait: {
              select: {
                id: true,
                titre: true,
                prix: true,
                description: true,
                duree: true,
                formatted_duree: true,
              },
            },
          },
        },
      },
    });

    // Adapter le format pour correspondre au DTO (un seul forfait_intervention attendu)
    return interventions.map((i) => {
      const fmt = (d: Date) =>
        formatInTimeZone(d, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");
      return {
        id: i.id,
        debut: fmt(i.debut),
        fin: fmt(i.fin),
        adresse: i.adresse,
        statut: i.statut,
        client_id: i.client_id,
        technicien_id: i.technicien_id,
        zone_id: i.zone_id,
        detail: i.detail,
        client: i.client,
        technicien: i.technicien,
        zone: i.zone,
        forfait_intervention: i.forfait_interventions[0]
          ? {
              id: i.forfait_interventions[0].id,
              id_forfait: i.forfait_interventions[0].id_forfait,
              id_intervention: i.forfait_interventions[0].id_intervention,
              prix: i.forfait_interventions[0].prix,
              duree: i.forfait_interventions[0].duree,
              forfait: i.forfait_interventions[0].forfait,
            }
          : null,
        createdAt: fmt(i.createdAt),
        updatedAt: fmt(i.updatedAt),
      };
    });
  }

  /**
   * Supprime une intervention par ID, en nettoyant également la table Forfait_Intervention liée.
   */
  async deleteInterventionById(
    id: string,
  ): Promise<DeleteInterventionResponseDto> {
    const exist = await this.prisma.intervention.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exist) throw new NotFoundException('Intervention introuvable');

    const result = await this.prisma.$transaction(async (tx) => {
      const forfaitDelete = await tx.forfait_Intervention.deleteMany({
        where: { id_intervention: id },
      });
      await tx.intervention.delete({ where: { id } });
      return { forfaitDeleteCount: forfaitDelete.count };
    });

    return {
      id,
      deleted: true,
      deletedForfaitsCount: result.forfaitDeleteCount,
    };
  }

  /**
   * Met à jour une intervention existante et, optionnellement, son forfait associé (snapshot prix/duree).
   */
  async updateIntervention(id: string, payload: UpdateInterventionDto) {
    const exist = await this.prisma.intervention.findUnique({
      where: { id },
      include: {
        zone: { include: { technicien: true } },
        forfait_interventions: true,
      },
    });
    if (!exist) throw new NotFoundException('Intervention introuvable');

    // Préparer les valeurs
    const newTechnicienId = payload.technicien_id ?? exist.technicien_id;
    const newZoneId = payload.zone_id ?? exist.zone_id;
    const newClientId =
      payload.client_id === undefined ? exist.client_id : payload.client_id;

    // Valider technicien si modifié
    if (payload.technicien_id) {
      const tech = await this.prisma.utilisateur.findFirst({
        where: { id: payload.technicien_id, role: 'TECHNICIEN' },
      });
      if (!tech) throw new BadRequestException('Technicien invalide');
    }

    // Valider client si fourni (peut être null -> détacher)
    if (payload.client_id !== undefined && payload.client_id !== null) {
      const client = await this.prisma.utilisateur.findFirst({
        where: { id: payload.client_id, role: 'CLIENT' },
      });
      if (!client) throw new BadRequestException('Client invalide');
    }

    // Valider zone si modifiée
    if (payload.zone_id) {
      const zone = await this.prisma.zone.findUnique({
        where: { id: payload.zone_id },
        include: { technicien: true },
      });
      if (!zone) throw new BadRequestException('Zone invalide');
      // S'assurer que la zone est assignée au technicien ciblé
      const targetTech = newTechnicienId;
      if (!zone.technicien || zone.technicien.id !== targetTech) {
        throw new BadRequestException(
          "Le technicien n'est pas assigné à la zone",
        );
      }
    } else {
      // Si seul le technicien change, vérifier la cohérence avec la zone actuelle
      if (payload.technicien_id) {
        const zone = await this.prisma.zone.findUnique({
          where: { id: newZoneId },
          include: { technicien: true },
        });
        if (
          !zone ||
          !zone.technicien ||
          zone.technicien.id !== newTechnicienId
        ) {
          throw new BadRequestException(
            "Le technicien n'est pas assigné à la zone",
          );
        }
      }
    }

    // Dates
    const newDebut = payload.debut ? new Date(payload.debut) : exist.debut;
    const newFin = payload.fin ? new Date(payload.fin) : exist.fin;
    if (isNaN(newDebut.getTime()) || isNaN(newFin.getTime())) {
      throw new BadRequestException('Dates invalides');
    }
    if (newFin <= newDebut)
      throw new BadRequestException('La fin doit être après le début');

    // Conflits horaires sur le technicien
    const conflict = await this.prisma.intervention.findFirst({
      where: {
        id: { not: exist.id },
        technicien_id: newTechnicienId,
        statut: { in: ['PLANNED', 'IN_PROGRESS', 'UNPLANNED'] },
        debut: { lt: newFin },
        fin: { gt: newDebut },
      },
      select: { id: true },
    });
    if (conflict) {
      throw new BadRequestException(
        'Conflit avec une autre intervention du technicien',
      );
    }

    // Appliquer la mise à jour principale
    await this.prisma.intervention.update({
      where: { id },
      data: {
        debut: newDebut,
        fin: newFin,
        adresse: payload.adresse ?? exist.adresse,
        statut: payload.statut ?? exist.statut,
        client_id: newClientId ?? null,
        technicien_id: newTechnicienId,
        zone_id: newZoneId,
        detail: payload.detail ?? exist.detail,
      },
    });

    // Gérer le forfait lié si demandé
    if (payload.forfait_id) {
      const forfait = await this.prisma.forfait.findUnique({
        where: { id: payload.forfait_id },
      });
      if (!forfait) throw new BadRequestException('Forfait invalide');

      const existingFi = exist.forfait_interventions[0];
      if (existingFi) {
        await this.prisma.forfait_Intervention.update({
          where: { id: existingFi.id },
          data: {
            id_forfait: forfait.id,
            prix: forfait.prix,
            duree: forfait.formatted_duree,
          },
        });
      } else {
        await this.prisma.forfait_Intervention.create({
          data: {
            id_forfait: forfait.id,
            id_intervention: id,
            prix: forfait.prix,
            duree: forfait.formatted_duree,
          },
        });
      }
    }

    // Retourner l'intervention à jour au format DTO de réponse
    const updated = await this.prisma.intervention.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        technicien: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        zone: { select: { id: true, nom: true, color: true } },
        forfait_interventions: {
          include: {
            forfait: {
              select: {
                id: true,
                titre: true,
                prix: true,
                description: true,
                duree: true,
                formatted_duree: true,
              },
            },
          },
        },
      },
    });

    const fmt = (d: Date) =>
      formatInTimeZone(d, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");
    return {
      id: updated.id,
      debut: fmt(updated.debut),
      fin: fmt(updated.fin),
      adresse: updated.adresse,
      statut: updated.statut,
      client_id: updated.client_id,
      technicien_id: updated.technicien_id,
      zone_id: updated.zone_id,
      detail: updated.detail,
      client: updated.client,
      technicien: updated.technicien,
      zone: updated.zone,
      forfait_intervention: updated.forfait_interventions[0]
        ? {
            id: updated.forfait_interventions[0].id,
            id_forfait: updated.forfait_interventions[0].id_forfait,
            id_intervention: updated.forfait_interventions[0].id_intervention,
            prix: updated.forfait_interventions[0].prix,
            duree: updated.forfait_interventions[0].duree,
            forfait: updated.forfait_interventions[0].forfait,
          }
        : null,
      createdAt: fmt(updated.createdAt),
      updatedAt: fmt(updated.updatedAt),
    };
  }

  /**
   * Crée en masse des interventions vides (UNPLANNED) d'une durée configurable (défaut 60min)
   * pour un technicien et une zone donnés, sur une plage de dates et heures.
   * Les créneaux qui chevauchent des interventions existantes (PLANNED/IN_PROGRESS) sont ignorés.
   */
  async bulkCreateEmptyInterventions(payload: BulkCreateEmptyInterventionsDto) {
    const {
      technicien_id,
      zone_id,
      date_debut,
      date_fin,
      heure_debut = 8,
      minute_debut = 0,
      heure_fin = 18,
      minute_fin = 0,
      duree_minutes = 60,
    } = payload;

    // Validation basique
    const tech = await this.prisma.utilisateur.findFirst({
      where: { id: technicien_id, role: 'TECHNICIEN' },
    });
    if (!tech) throw new BadRequestException('Technicien introuvable');

    const zone = await this.prisma.zone.findUnique({
      where: { id: zone_id },
      include: { technicien: true },
    });
    if (!zone) throw new BadRequestException('Zone introuvable');
    if (!zone.technicien || zone.technicien.id !== technicien_id) {
      throw new BadRequestException('Technicien non assigné à la zone');
    }

    // Construire la plage date -> date inclusive
    const start = new Date(date_debut);
    const end = new Date(date_fin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Dates invalides');
    }
    if (end < start)
      throw new BadRequestException('date_fin doit être >= date_debut');

    // Précharger les interventions existantes du technicien dans l'intervalle
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(end);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await this.prisma.intervention.findMany({
      where: {
        technicien_id,
        statut: { in: ['PLANNED', 'IN_PROGRESS', 'UNPLANNED'] },
        OR: [
          {
            debut: { lt: dayEnd },
            fin: { gt: dayStart },
          },
        ],
      },
      select: { debut: true, fin: true },
    });

    const createdIds: string[] = [];
    let skippedCount = 0;

    // Générer jour par jour, par pas de duree_minutes
    const iter = new Date(start);
    while (iter <= end) {
      // On travaille sur ce jour calendaire
      const base = new Date(iter);
      const daySlotStart = new Date(base);
      daySlotStart.setHours(heure_debut, minute_debut, 0, 0);
      const dayEndLimit = new Date(base);
      dayEndLimit.setHours(heure_fin, minute_fin, 0, 0);

      for (let t = new Date(daySlotStart); t < dayEndLimit; ) {
        const slotStart = new Date(t);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + duree_minutes);

        // Si dépassement de la plage journalière, on arrête la boucle de la journée
        if (slotEnd > dayEndLimit) break;

        // Chevauchement avec existant ?
        const overlap = existing.some(
          (e) => slotStart < e.fin && slotEnd > e.debut,
        );
        if (overlap) {
          skippedCount++;
        } else {
          // Créer l'intervention vide (UNPLANNED), sans client/adresse/forfait
          const created = await this.prisma.intervention.create({
            data: {
              debut: slotStart,
              fin: slotEnd,
              statut: 'UNPLANNED',
              technicien_id,
              zone_id,
            },
            select: { id: true },
          });
          createdIds.push(created.id);
        }

        // Incrémenter du pas
        t.setMinutes(t.getMinutes() + duree_minutes);
      }

      // Jour suivant
      iter.setDate(iter.getDate() + 1);
    }

    return { createdCount: createdIds.length, skippedCount, createdIds };
  }

  /**
   * Supprime toutes les interventions d'un technicien sur une plage de jours inclusive.
   * Nettoie d'abord les enregistrements Forfait_Intervention liés.
   */
  async deleteInterventionsByTechnicienAndDateRange(
    technicien_id: string,
    payload: DeleteInterventionsRangeDto,
  ) {
    const { date_debut, date_fin } = payload;

    // Vérifier l'existence du technicien
    const technicien = await this.prisma.utilisateur.findFirst({
      where: { id: technicien_id, role: 'TECHNICIEN' },
      select: { id: true },
    });
    if (!technicien) {
      throw new NotFoundException('Technicien introuvable');
    }

    // Calculer bornes inclusives de jour
    const start = new Date(date_debut);
    const end = new Date(date_fin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Dates invalides');
    }
    if (end < start) {
      throw new BadRequestException('date_fin doit être >= date_debut');
    }
    const from = new Date(start);
    from.setHours(0, 0, 0, 0);
    const to = new Date(end);
    to.setHours(23, 59, 59, 999);

    // Récupérer les interventions concernées pour compter/retourner les ids
    const interventions = await this.prisma.intervention.findMany({
      where: {
        technicien_id,
        debut: { lte: to },
        fin: { gte: from },
      },
      select: { id: true },
    });

    if (interventions.length === 0) {
      return {
        deletedInterventionsCount: 0,
        deletedForfaitsCount: 0,
        interventionIds: [],
      };
    }

    const ids = interventions.map((i) => i.id);

    // Transaction: supprimer d'abord les lignes de jointure puis les interventions
    const result = await this.prisma.$transaction(async (tx) => {
      const forfaitDelete = await tx.forfait_Intervention.deleteMany({
        where: { id_intervention: { in: ids } },
      });
      const interDelete = await tx.intervention.deleteMany({
        where: { id: { in: ids } },
      });
      return { forfaitDelete, interDelete };
    });

    return {
      deletedInterventionsCount: result.interDelete.count,
      deletedForfaitsCount: result.forfaitDelete.count,
      interventionIds: ids,
    };
  }

  /**
   * Retourne les interventions UNPLANNED, filtrables par zone et par jour calendaire (Europe/Paris).
   * - Si 'jour' est fourni, on récupère tout créneau qui chevauche ce jour (overlap).
   */
  async findUnplanned(
    query: ListUnplannedInterventionsQueryDto,
  ): Promise<any[]> {
    const { zone_id, jour } = query;
    const tz = 'Europe/Paris';

    // Construction du filtre de base
    const where: any = {
      statut: 'UNPLANNED',
    };

    if (zone_id) {
      where.zone_id = zone_id;
    }

    // Si un jour est fourni (YYYY-MM-DD), on prend tout chevauchement avec ce jour en Europe/Paris.
    if (jour) {
      // bornes inclusives du jour en Europe/Paris -> converties en UTC pour la base
      const startOfDayUtc = zonedTimeToUtc(`${jour}T00:00:00`, tz);
      const endOfDayUtc = zonedTimeToUtc(`${jour}T23:59:59.999`, tz);

      // On cherche tout créneau qui chevauche [startOfDayUtc, endOfDayUtc]
      where.debut = { lt: endOfDayUtc };
      where.fin = { gt: startOfDayUtc };
    }

    const interventions = await this.prisma.intervention.findMany({
      where,
      orderBy: [{ debut: 'asc' }],
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        technicien: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        zone: { select: { id: true, nom: true, color: true } },
        forfait_interventions: {
          include: {
            forfait: {
              select: {
                id: true,
                titre: true,
                prix: true,
                description: true,
                duree: true,
                formatted_duree: true,
              },
            },
          },
        },
      },
    });

    const fmt = (d: Date) =>
      formatInTimeZone(d, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");

    return interventions.map((i) => ({
      id: i.id,
      debut: fmt(i.debut),
      fin: fmt(i.fin),
      adresse: i.adresse,
      statut: i.statut,
      client_id: i.client_id,
      technicien_id: i.technicien_id,
      zone_id: i.zone_id,
      detail: i.detail,
      client: i.client,
      technicien: i.technicien,
      zone: i.zone,
      forfait_intervention: i.forfait_interventions[0]
        ? {
            id: i.forfait_interventions[0].id,
            id_forfait: i.forfait_interventions[0].id_forfait,
            id_intervention: i.forfait_interventions[0].id_intervention,
            prix: i.forfait_interventions[0].prix,
            duree: i.forfait_interventions[0].duree,
            forfait: i.forfait_interventions[0].forfait,
          }
        : null,
      createdAt: fmt(i.createdAt),
      updatedAt: fmt(i.updatedAt),
    }));
  }
  async findPlanned(
    query: ListPlannedInterventionsQueryDto,
  ): Promise<
    import('/Users/thomasgalinier/Documents/hch/hch-back/src/intervention/dto/response.dto').InterventionResponseDto[]
  > {
    const { zone_id, jour, technicien_id } = query;

    const tz = 'Europe/Paris';

    // Construction du filtre de base
    const where: any = {
      NOT: { statut: 'UNPLANNED' },
    };
    if (technicien_id) {
      where.technicien_id = technicien_id;
    }
    if (zone_id) {
      where.zone_id = zone_id;
    }

    // Si un jour est fourni (YYYY-MM-DD), on prend tout chevauchement avec ce jour en Europe/Paris.
    if (jour) {
      // bornes inclusives du jour en Europe/Paris -> converties en UTC pour la base
      const startOfDayUtc = zonedTimeToUtc(`${jour}T00:00:00`, tz);
      const endOfDayUtc = zonedTimeToUtc(`${jour}T23:59:59.999`, tz);

      // On cherche tout créneau qui chevauche [startOfDayUtc, endOfDayUtc]
      where.debut = { lt: endOfDayUtc };
      where.fin = { gt: startOfDayUtc };
    }

    const interventions = await this.prisma.intervention.findMany({
      where,
      orderBy: [{ debut: 'asc' }],
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        technicien: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        zone: { select: { id: true, nom: true, color: true } },
        forfait_interventions: {
          include: {
            forfait: {
              select: {
                id: true,
                titre: true,
                prix: true,
                description: true,
                duree: true,
                formatted_duree: true,
                categorie_velo: true,
              },
            },
          },
        },
      },
    });

    const fmt = (d: Date) =>
      formatInTimeZone(d, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");

    return interventions.map((i) => ({
      id: i.id,
      debut: fmt(i.debut),
      fin: fmt(i.fin),
      adresse: i.adresse,
      statut: i.statut,
      client_id: i.client_id,
      technicien_id: i.technicien_id,
      zone_id: i.zone_id,
      detail: i.detail,
      client: i.client,
      technicien: i.technicien,
      zone: i.zone,
      forfait_intervention: i.forfait_interventions[0]
        ? {
            id: i.forfait_interventions[0].id,
            id_forfait: i.forfait_interventions[0].id_forfait,
            id_intervention: i.forfait_interventions[0].id_intervention,
            prix: i.forfait_interventions[0].prix,
            duree: i.forfait_interventions[0].duree,
            forfait: i.forfait_interventions[0].forfait,
          }
        : null,
      createdAt: fmt(i.createdAt),
      updatedAt: fmt(i.updatedAt),
    }));
  }
  async autoStartPlannedNow() {
    const now = new Date();

    const plannedNow = await this.prisma.intervention.findMany({
      where: {
        statut: 'PLANNED',
        debut: { lte: now },
        fin: { gt: now },
      },
      select: { id: true },
    });

    if (plannedNow.length === 0) {
      return { updatedCount: 0, interventionIds: [] };
    }

    const ids = plannedNow.map((i) => i.id);

    const { count } = await this.prisma.intervention.updateMany({
      where: { id: { in: ids } },
      data: { statut: 'IN_PROGRESS' },
    });

    return { updatedCount: count, interventionIds: ids };
  }

  /**
   * Liste paginée des interventions d'un client, triées du plus récent au plus ancien.
   */
  async findByClientPaginated(
    client_id: string,
    query: ListClientInterventionsQueryDto,
  ): Promise<{
    data: any[]; // idéalement InterventionResponseDto[]
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    // Vérifier l'existence du client
    const client = await this.prisma.utilisateur.findFirst({
      where: { id: client_id, role: 'CLIENT' },
      select: { id: true },
    });
    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 10));
    const skip = (page - 1) * limit;

    // Compter le total pour la pagination
    const [total, interventions] = await this.prisma.$transaction([
      this.prisma.intervention.count({ where: { client_id } }),
      this.prisma.intervention.findMany({
        where: { client_id },
        orderBy: { debut: 'desc' }, // plus récent -> plus ancien
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              telephone: true,
            },
          },
          technicien: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              telephone: true,
            },
          },
          zone: { select: { id: true, nom: true, color: true } },
          forfait_interventions: {
            include: {
              forfait: {
                select: {
                  id: true,
                  titre: true,
                  prix: true,
                  description: true,
                  duree: true,
                  formatted_duree: true,
                  // si besoin: categorie_velo
                },
              },
            },
          },
        },
      }),
    ]);

    const fmt = (d: Date) =>
      formatInTimeZone(d, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");

    const data = interventions.map((i) => ({
      id: i.id,
      debut: fmt(i.debut),
      fin: fmt(i.fin),
      adresse: i.adresse,
      statut: i.statut,
      client_id: i.client_id,
      technicien_id: i.technicien_id,
      zone_id: i.zone_id,
      detail: i.detail,
      client: i.client,
      technicien: i.technicien,
      zone: i.zone,
      forfait_intervention: i.forfait_interventions[0]
        ? {
            id: i.forfait_interventions[0].id,
            id_forfait: i.forfait_interventions[0].id_forfait,
            id_intervention: i.forfait_interventions[0].id_intervention,
            prix: i.forfait_interventions[0].prix,
            duree: i.forfait_interventions[0].duree,
            forfait: i.forfait_interventions[0].forfait,
          }
        : null,
      createdAt: fmt(i.createdAt),
      updatedAt: fmt(i.updatedAt),
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
