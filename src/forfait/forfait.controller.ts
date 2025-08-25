import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ForfaitService } from './forfait.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import { CreateForfaitDto } from './dto/createForfaitDto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Forfaits')
@ApiBearerAuth()
@Controller('forfait')
export class ForfaitController {
  constructor(private readonly forfaitService: ForfaitService) {}

  @ApiOperation({
    summary: 'Récupérer tous les forfaits',
    description:
      'Récupère la liste de tous les forfaits disponibles. Nécessite les droits ADMIN ou SUPER_ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des forfaits récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID unique du forfait' },
          titre: { type: 'string', description: 'Titre du forfait' },
          prix: { type: 'number', description: 'Prix du forfait en euros' },
          description: {
            type: 'string',
            description: 'Description détaillée du forfait',
          },
          type: { type: 'string', description: 'Type de forfait' },
          categorie_velo: {
            type: 'string',
            description: 'Catégorie de vélo concernée',
          },
          duree: {
            type: 'string',
            description: 'Durée du forfait (format lisible)',
          },
          formatted_duree: {
            type: 'number',
            description: 'Durée du forfait en millisecondes',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date de création',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date de dernière modification',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Token d'authentification manquant ou invalide",
  })
  @ApiForbiddenResponse({
    description: 'Droits insuffisants (ADMIN ou SUPER_ADMIN requis)',
  })
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN', 'CLIENT', 'CLIENT')
@Get('/')
@ApiOperation({
  summary: 'Récupérer tous les forfaits',
  description:
    'Récupère la liste de tous les forfaits disponibles. Filtrage possible par titre via le query param ?titre=...',
})
@ApiQuery({
  name: 'titre',
  required: false,
  description: 'Filtrer les forfaits dont le titre contient cette valeur (insensible à la casse)',
  example: 'Premium',
})
getForfait(@Query('titre') titre?: string) {
  return this.forfaitService.getForfait(titre);
}

  @ApiOperation({
    summary: 'Créer un nouveau forfait',
    description:
      'Crée un nouveau forfait avec les informations fournies. Nécessite les droits ADMIN ou SUPER_ADMIN.',
  })
  @ApiBody({
    type: CreateForfaitDto,
    description: 'Données du forfait à créer',
  })
  @ApiResponse({
    status: 201,
    description: 'Forfait créé avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID unique du forfait créé' },
        titre: { type: 'string', description: 'Titre du forfait' },
        prix: { type: 'number', description: 'Prix du forfait en euros' },
        description: {
          type: 'string',
          description: 'Description détaillée du forfait',
        },
        type: { type: 'string', description: 'Type de forfait' },
        categorie_velo: {
          type: 'string',
          description: 'Catégorie de vélo concernée',
        },
        duree: {
          type: 'string',
          description: 'Durée du forfait (format lisible)',
        },
        formatted_duree: {
          type: 'number',
          description: 'Durée du forfait en millisecondes',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de création',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de dernière modification',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Données invalides ou manquantes' })
  @ApiUnauthorizedResponse({
    description: "Token d'authentification manquant ou invalide",
  })
  @ApiForbiddenResponse({
    description: 'Droits insuffisants (ADMIN ou SUPER_ADMIN requis)',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('/create')
  createForfait(@Body() createForfaitDto: CreateForfaitDto) {
    return this.forfaitService.createForfait(createForfaitDto);
  }

  @ApiOperation({
    summary: 'Mettre à jour un forfait',
    description:
      "Met à jour les informations d'un forfait existant. Nécessite les droits ADMIN ou SUPER_ADMIN.",
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID unique du forfait à mettre à jour',
  })
  @ApiBody({
    description: 'Nouvelles données du forfait',
    schema: {
      type: 'object',
      properties: {
        forfait: {
          type: 'object',
          properties: {
            titre: { type: 'string', description: 'Titre du forfait' },
            prix: {
              type: 'string',
              description: 'Prix du forfait (sera converti en nombre)',
            },
            description: {
              type: 'string',
              description: 'Description détaillée du forfait',
            },
            type: { type: 'string', description: 'Type de forfait' },
            categorie_velo: {
              type: 'string',
              description: 'Catégorie de vélo concernée',
            },
            duree: {
              type: 'string',
              description: 'Durée du forfait (format lisible)',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Forfait mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID unique du forfait' },
        titre: { type: 'string', description: 'Titre du forfait' },
        prix: { type: 'number', description: 'Prix du forfait en euros' },
        description: {
          type: 'string',
          description: 'Description détaillée du forfait',
        },
        type: { type: 'string', description: 'Type de forfait' },
        categorie_velo: {
          type: 'string',
          description: 'Catégorie de vélo concernée',
        },
        duree: {
          type: 'string',
          description: 'Durée du forfait (format lisible)',
        },
        formatted_duree: {
          type: 'number',
          description: 'Durée du forfait en millisecondes',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de création',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de dernière modification',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Données invalides ou ID manquant' })
  @ApiNotFoundResponse({ description: 'Forfait non trouvé' })
  @ApiUnauthorizedResponse({
    description: "Token d'authentification manquant ou invalide",
  })
  @ApiForbiddenResponse({
    description: 'Droits insuffisants (ADMIN ou SUPER_ADMIN requis)',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('/update/:id')
  updateForfait(@Req() request: Request) {
    return this.forfaitService.updateForfait(request);
  }

  @ApiOperation({
    summary: 'Supprimer un forfait',
    description:
      'Supprime définitivement un forfait existant. Nécessite les droits ADMIN ou SUPER_ADMIN.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID unique du forfait à supprimer',
  })
  @ApiResponse({
    status: 200,
    description: 'Forfait supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID du forfait supprimé' },
        titre: { type: 'string', description: 'Titre du forfait supprimé' },
        prix: { type: 'number', description: 'Prix du forfait supprimé' },
        description: {
          type: 'string',
          description: 'Description du forfait supprimé',
        },
        type: { type: 'string', description: 'Type du forfait supprimé' },
        categorie_velo: {
          type: 'string',
          description: 'Catégorie de vélo du forfait supprimé',
        },
        duree: { type: 'string', description: 'Durée du forfait supprimé' },
        formatted_duree: {
          type: 'number',
          description: 'Durée formatée du forfait supprimé',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de création',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date de dernière modification',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Forfait non trouvé' })
  @ApiUnauthorizedResponse({
    description: "Token d'authentification manquant ou invalide",
  })
  @ApiForbiddenResponse({
    description: 'Droits insuffisants (ADMIN ou SUPER_ADMIN requis)',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('/delete/:id')
  deleteForfait(@Req() request: Request) {
    return this.forfaitService.deleteForfait(request);
  }
}
