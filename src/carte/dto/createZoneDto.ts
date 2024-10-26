import { IsNotEmpty, IsOptional } from "class-validator";

export class  CreateZoneDto {
  @IsNotEmpty()
  readonly nom: string
  @IsNotEmpty()
  readonly polygone: [[number,number]]
  @IsOptional()
  readonly idTechnicien: string
}