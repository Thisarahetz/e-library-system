import { Controller, Post, Body, UseGuards, Req, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { User } from '../../src/user/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // login(@Req() req: AuthenticatedRequest) {
  //   return this.authService.login(req.user as User);
  // }

  // @Post('signup')
  // async signUp(@Body() body: CreateUserDto) {
  //   return await this.authService.signUp(body);
  // }

  // @Put(':id')
  // async userUpdate(@Param('id') id: string, @Body() body: UpdateUserDto) {
  //   return await this.authService.updateUser(id, body);
  // }
}
