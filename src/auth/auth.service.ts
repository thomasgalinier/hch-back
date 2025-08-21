import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ClientSignupDto } from './dto/ClientSignupDto';

@Injectable()
export class AuthService {
  async clientSignup(clientSignupDto: ClientSignupDto) {
    const { email, password, nom, prenom, telephone } = clientSignupDto;
    const client = await this.prisamService.utilisateur.findUnique({
      where: { email },
    });
    if (client) throw new ConflictException('Le client existe déjà');
    const hash = await bcrypt.hash(password, 10);
    const newClient = await this.prisamService.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        password: hash,
        telephone,
        role: 'CLIENT',
      },
    });
    const payload = { email: newClient.email, sub: newClient.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token,
      user: {
        id: newClient.id,
        email: newClient.email,
        nom: newClient.nom,
        prenom: newClient.prenom,
        telephone: newClient.telephone,
      },
    };
  }
  constructor(
    private readonly prisamService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, nom, prenom, telephone, role } = signupDto;
    const user = await this.prisamService.utilisateur.findUnique({
      where: { email },
    });
    if (user) throw new ConflictException("l'utilisateur existe déjà");
    const hash = await bcrypt.hash(password, 10);

    const newClient = await this.prisamService.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        password: hash,
        telephone,
        role,
      },
    });
    const payload = { email: newClient.email, sub: newClient.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token,
      user: {
        id: newClient.id,
        email: newClient.email,
        nom: newClient.nom,
        prenom: newClient.prenom,
        telephone: newClient.telephone,
      },
    };
  }

  async signin(signinDto: SigninDto, res: Response) {
    const { email, password } = signinDto;
    const utilisateur = await this.prisamService.utilisateur.findUnique({
      where: { email },
    });
    if (!utilisateur) throw new NotFoundException("L'utilisateur n'existe pas");
    const match = await bcrypt.compare(password, utilisateur.password);
    if (!match) throw new UnauthorizedException('Mot de passe incorrect');
    const payload = { email: utilisateur.email, sub: utilisateur.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get('SECRET_KEY'),
    });
    const isProd = this.configService.get('NODE_ENV') === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return {
      user: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        telephone: utilisateur.telephone,
      },
    };
  }

  getAll() {
    return this.prisamService.utilisateur.findMany();
  }

  delete(request: Request) {
    const id = request.params.id;
    return this.prisamService.utilisateur.delete({ where: { id } });
  }

  update(request: Request) {
    const id = request.params.id;
    return this.prisamService.utilisateur.update({
      where: { id },
      data: request.body,
    });
  }

  getTechnicien() {
    return this.prisamService.utilisateur.findMany({
      where: { role: 'TECHNICIEN' },
      select: {
        zone: { select: { id: true } },
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
      },
    });
  }

  getClient() {
    return this.prisamService.utilisateur.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        role: true,
      },
    });
  }

  logout(res: Response) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });
    return { message: 'Déconnexion réussie' };
  }
}
