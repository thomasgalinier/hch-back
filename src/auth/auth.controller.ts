import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signinDto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LogoutResponseDto,
  SigninResponseDto,
  SignupResponseDto,
} from './dto/auth.response.dto';
import { UserDto } from './dto/user.dto';
import { ClientSignupDto } from './dto/ClientSignupDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Créer un utilisateur et retourner un token' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé',
    type: SignupResponseDto,
  })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('/client/signup')
  @ApiOperation({ summary: 'Créer un client et retourner un token' })
  @ApiBody({ type: ClientSignupDto })
  @ApiResponse({
    status: 201,
    description: 'Client créé',
    type: SignupResponseDto,
  })
  clientSignup(@Body() clientSignupDto: ClientSignupDto) {
    return this.authService.clientSignup(clientSignupDto);
  }

  @Post('signin')
  @ApiOperation({
    summary: 'Se connecter (cookie HttpOnly fixé)',
    description: "Retourne l'utilisateur; le JWT est fixé en cookie 'token'",
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    type: SigninResponseDto,
  })
  signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(signinDto, res);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'TECHNICIEN', 'SUPER_ADMIN')
  @Get('all')
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiResponse({ status: 200, type: [UserDto] })
  getAll() {
    return this.authService.getAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Supprimer un utilisateur (ADMIN uniquement)' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, type: UserDto })
  delete(@Req() request: Request) {
    return this.authService.delete(request);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update/:id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (ADMIN uniquement)' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiBody({
    schema: {
      example: { nom: 'Doe', prenom: 'Jane', telephone: '+33601020304' },
    },
  })
  @ApiResponse({ status: 200, type: UserDto })
  update(@Req() request: Request) {
    return this.authService.update(request);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TECHNICIEN', 'CLIENT')
  @Get('me')
  @ApiOperation({ summary: 'Obtenir l’utilisateur courant (depuis le JWT)' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiResponse({ status: 200, type: UserDto })
  getMe(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('technicien')
  @ApiOperation({ summary: 'Lister les techniciens' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiResponse({ status: 200, type: [UserDto] })
  getTechnicien() {
    return this.authService.getTechnicien();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'TECHNICIEN', 'SUPER_ADMIN')
  @Get('client')
  @ApiOperation({ summary: 'Lister les clients' })
  @ApiBearerAuth()
  @ApiCookieAuth('token')
  @ApiResponse({ status: 200, type: [UserDto] })
  getClient() {
    return this.authService.getClient();
  }

  @Post('logout')
  @ApiOperation({ summary: 'Se déconnecter (cookie supprimé)' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
