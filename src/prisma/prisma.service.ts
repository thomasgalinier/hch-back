import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as process from "node:process";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url : configService.get('DATABASE_URL'),
        }
      }
    })
  }
}
