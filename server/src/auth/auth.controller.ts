import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  HttpException,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ICreateUser } from "../users/interfaces/user.interface";
import { CreateUserDto } from "../users/dtos/user.dto";
import { AuthService } from "./auth.service";
import { ProtectGuard } from "./protect.guard";
import { JwtAuthGuard } from "./auth.guard";
@Controller("/")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register/signup")
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.create(body);
    if (user instanceof HttpException) throw user;
    return null;
  }

  @Post("auth")
  @UseGuards(JwtAuthGuard)
  async Auth() {
    return {};
  }
}
