import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { SignupDto } from "./dto/signupDto";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signinDto";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { RolesGuard } from '../common/middleware/role.middleware';
import { Roles } from '../common/decorator/role.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post("signin")
  signin(@Body() signinDto: SigninDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(signinDto, res);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'TECHNICIEN', 'SUPER_ADMIN')
  @Get("all")
  getAll() {
    return this.authService.getAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete("delete/:id")
  delete(@Req() request: Request) {
    return this.authService.delete(request);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put("update/:id")
  update(@Req() request: Request) {
    return this.authService.update(request);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("me")
  getMe(@Req() request: Request){

    return request.user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("technicien")
  getTechnicien(@Req() request: Request){
    return this.authService.getTechnicien(request);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'TECHNICIEN', 'SUPER_ADMIN')
  @Get("client")
  getClient() {
    return this.authService.getClient();
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response){
    return this.authService.logout(res)
  }
}
