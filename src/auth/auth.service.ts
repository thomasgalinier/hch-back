import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientSignupDto} from "./dto/clientSignupDto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { AdminSignupDto } from "./dto/adminSignupDto";
import { TechnicienSignupDto } from "./dto/technicienSignupDto";
import { ClientSigninDto } from "./dto/clientSigninDto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AdminSigninDto } from "./dto/adminSigninDto";
import { TechnicienSigninDto } from "./dto/technicienSigninDto";

@Injectable()
export class AuthService {
  constructor(private readonly prisamService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  async signup(clientSignupDto: ClientSignupDto) {
    const {email, password,nom, prenom, codePostal, telephone, ville, adresse} = clientSignupDto;
    const client = await this.prisamService.client.findUnique({where: {email}});
    if(client) throw  new ConflictException('Le client existe déjà');
    const hash = await bcrypt.hash(password, 10)
    await this.prisamService.client.create({
      data:{
        nom,
        prenom,
        email,
        password: hash,
        telephone,
        ville,
        code_postal: codePostal,
        adresse

      }
    })
    return {data: 'Client créé avec succès'};
  }

  async signupAdmin(adminSignupDto: AdminSignupDto) {
    const {nom,prenom,password,email,role, userId} = adminSignupDto;
    const user = await this.prisamService.administrateur.findUnique({where: {id: userId}});
    console.log(user);
    if(!user) throw new UnauthorizedException("Utilisateur non autorisé");
    const admin = await this.prisamService.administrateur.findUnique({where: {email}});
    if(admin) throw new ConflictException("L'administrateur existe déjà");

    const hash = await bcrypt.hash(password, 10);
    await this.prisamService.administrateur.create({
      data:{
        nom,
        prenom,
        email,
        password: hash,
        role,
        // TODO récuperer l'entreprise_id depuis le front lors de la création de l'admin
        entreprise_id: "1"
      }
    })
    return {data: 'Administrateur créé avec succès'};
  }

  async signupTechnicien(technicienSignupDto: TechnicienSignupDto) {
    const {nom,prenom,password,email,telephone,entreprise_id, userId} = technicienSignupDto;
    const user = await this.prisamService.administrateur.findUnique({where: {id: userId}});
    if(!user) throw new UnauthorizedException("Utilisateur non autorisé");
    const technicien = await this.prisamService.technicien.findUnique({where: {email}});
    if (technicien) throw new ConflictException("Le technicien existe déjà");
    const hash = await bcrypt.hash(password, 10);
    await this.prisamService.technicien.create({
      data:{
        nom,
        prenom,
        email,
        password: hash,
        telephone,
        entreprise_id
      }
    })
    return {data: 'Technicien créé avec succès'};
  }

  async signin(clientSigninDto: ClientSigninDto) {
    const {email, password} = clientSigninDto;
    const client = await this.prisamService.client.findUnique({where: {email}});
    if(!client) throw new NotFoundException("Le client n'existe pas");
    const match = await bcrypt.compare(password, client.password);
    if(!match) throw new UnauthorizedException("Mot de passe incorrect");
    const payload = {email: client.email, sub: client.id};
    const token = this.jwtService.sign(payload, { expiresIn: "1d", secret: this.configService.get('SECRET_KEY')});
    return {
      token, user: {
        id: client.id,
        email: client.email,
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone,
        ville: client.ville,
        codePostal: client.code_postal,
        adresse: client.adresse
      }
    }
  }

  async signinAdmin(adminSigninDto: AdminSigninDto) {
    const { email, password } = adminSigninDto;
    const admin = await this.prisamService.administrateur.findUnique({ where: { email } });
    if (!admin) throw new NotFoundException("L'administrateur n'existe pas");
    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new UnauthorizedException("Mot de passe incorrect");
    const payload = { email: admin.email, sub: admin.id };
    const token = this.jwtService.sign(payload, { expiresIn: "1d", secret: this.configService.get('SECRET_KEY') });
    return {
      token, user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
        entreprise_id: admin.entreprise_id
      }
    }
  }

  async signinTechnicien(technicienSigninDto: TechnicienSigninDto) {
    const { email, password } = technicienSigninDto;
    const technicien = await this.prisamService.technicien.findUnique({ where: { email } });
    if (!technicien) throw new NotFoundException("Le technicien n'existe pas");
    const match = bcrypt.compare(password, technicien.password);
    if (!match) throw new UnauthorizedException("Mot de passe incorrect");
    const payload = { email: technicien.email, sub: technicien.id };
    const token = this.jwtService.sign(payload, { expiresIn: "1d", secret: this.configService.get('SECRET_KEY') });
    return {
      token, user: {
        id: technicien.id,
        email: technicien.email,
        nom: technicien.nom,
        prenom: technicien.prenom,
        telephone: technicien.telephone,
        entreprise_id: technicien.entreprise_id
      }
    }
  }
}
