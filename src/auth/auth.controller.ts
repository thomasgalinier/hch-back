import { Body, Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { SignupDto } from "./dto/signupDto";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/signinDto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signup")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post("signin")
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("all")
  getAll(@Req() request: Request) {
    return this.authService.getAll(request);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete("delete/:id")
  delete(@Req() request: Request) {
    return this.authService.delete(request);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("me")
  getMe(@Req() request: Request){
    return request.user;
  }
}
