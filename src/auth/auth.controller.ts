import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ClientSignupDto } from "./dto/clientSignupDto";
import { AuthService } from "./auth.service";
import { AdminSignupDto } from "./dto/adminSignupDto";
import { TechnicienSignupDto } from "./dto/technicienSignupDto";
import { ClientSigninDto } from "./dto/clientSigninDto";
import { AdminSigninDto } from "./dto/adminSigninDto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { TechnicienSigninDto } from "./dto/technicienSigninDto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signup/client")
  signup(@Body() clientSignupDto: ClientSignupDto) {
    return this.authService.signup(clientSignupDto);
  }
  @Post("signin/client")
  signin(@Body() clientSigninDto: ClientSigninDto) {
    return this.authService.signin(clientSigninDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post("signup/admin")
  signupAdmin(@Body() adminSignupDto: AdminSignupDto, @Req() request: Request) {
    adminSignupDto.userId = request.user['id'];
    return this.authService.signupAdmin(adminSignupDto);
  }
  @Post("signin/admin")
  signinAdmin(@Body() adminSigninDto: AdminSigninDto ) {
    return this.authService.signinAdmin(adminSigninDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post("signup/technicien")
  signupTechnicien(@Body() technicienSignupDto: TechnicienSignupDto, @Req() request: Request) {
    technicienSignupDto.userId = request.user['id'];
    return this.authService.signupTechnicien(technicienSignupDto);
  }
  @Post("signin/technicien")
  signinTechnicien(@Body() technicienSigninDto: TechnicienSigninDto) {
    return this.authService.signinTechnicien(technicienSigninDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("me")
  getMe(@Req() request: Request){
    return request.user;
  }
}
