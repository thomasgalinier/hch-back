import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignupDto} from "./dto/signupDto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { SigninDto } from "./dto/signinDto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";


@Injectable()
export class AuthService {
  constructor(private readonly prisamService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  async signup(signupDto: SignupDto) {
    const {email, password,nom, prenom, telephone, role} = signupDto;
    const client = await this.prisamService.utilisateur.findUnique({where: {email}});
    if(client) throw  new ConflictException('Le client existe déjà');
    const hash = await bcrypt.hash(password, 10)

    const newClient = await this.prisamService.utilisateur.create({
      data:{
        nom,
        prenom,
        email,
        password: hash,
        telephone,
        role
      }
    })
    const payload = {email: newClient.email, sub: newClient.id};
    const token = this.jwtService.sign(payload, { expiresIn: "1d", secret: this.configService.get('SECRET_KEY')});
    return {
      token,
      user: {
        id: newClient.id,
        email: newClient.email,
        nom: newClient.nom,
        prenom: newClient.prenom,
        telephone: newClient.telephone, }
    };

  }

  async signin(signinDto: SigninDto) {
    const {email, password} = signinDto;
    const utilisateur = await this.prisamService.utilisateur.findUnique({where: {email}});
    if(!utilisateur) throw new NotFoundException("L'utilisateur n'existe pas");
    const match = await bcrypt.compare(password, utilisateur.password);
    if(!match) throw new UnauthorizedException("Mot de passe incorrect");
    const payload = {email: utilisateur.email, sub: utilisateur.id};
    const token = this.jwtService.sign(payload, { expiresIn: "1d", secret: this.configService.get('SECRET_KEY')});
    return {
      token, user: {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        telephone: utilisateur.telephone,
      }
    }
  }

  getAll(request: Request ) {
    const user = request.user;
    // @ts-ignore
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if(!isAdmin) throw new UnauthorizedException('Vous n\'êtes pas autorisé à accéder à cette ressource');
    return this.prisamService.utilisateur.findMany();
  }

  delete(request: Request) {
    const user = request.user;
    // @ts-ignore
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if(!isAdmin) throw new UnauthorizedException('Vous n\'êtes pas autorisé à accéder à cette ressource');
    const id = request.params.id;
    return this.prisamService.utilisateur.delete({where: {id}});
  }

  update(request: Request) {
    const user = request.user;
    // @ts-ignore
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    if(!isAdmin) throw new UnauthorizedException('Vous n\'êtes pas autorisé à accéder à cette ressource');
    const id = request.params.id;
    console.log(request);
    return this.prisamService.utilisateur.update({where: {id}, data: request.body});
  }
}
