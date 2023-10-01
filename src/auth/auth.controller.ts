// auth.controller.ts
import { Controller, Post, Body, HttpException, Headers, HttpCode, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service'; // Assuming you have a user service to handle user-related operations
import { LoginUserDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ResponseData, generateResponse } from 'src/utility/response.utill';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseObject } from './interfaces/response-object.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  // @Post('login')
  // async login(@Body() loginDto: LoginUserDto): Promise<any> {
  //   const { email, password } = loginDto;

  //   // Find the user in the database based on the provided EMAIL (should be unique)
  //   const user = await this.userService.findOneByEmail(email);

  //   if (!user || !(await this.userService.verifyPassword(password, user.password))) {
  //     throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //   }

  //   // If the user is found and the password is correct, create a JWT token
  //   const payload: JwtPayload = { id: user.id, username: user.email, role: user.role };

  //   const token = this.jwtService.sign(payload);

  //   delete user.password;

  //   return generateResponse(true, 200, 'Login successfully', { token, user });
  // }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  authenticate(@Body() dto: LoginUserDto): Promise<ResponseData<any>> {
    return this.authService.authenticate(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Headers('authorization') token: string): Promise<ResponseObject> {
    return this.authService.logout(token);
  }
}
