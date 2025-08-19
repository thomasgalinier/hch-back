import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

type Payload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token, // 👈 essentiel
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: Payload) {
    const utilisateur = await this.prismaService.utilisateur.findUnique({
      where: { id: payload.sub },
    });

    if (!utilisateur) {
      throw new Error('User not found');
    }

    Reflect.deleteProperty(utilisateur, 'password');
    return utilisateur;
  }
}
