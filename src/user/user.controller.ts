import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto, UpdateProfileDto } from './dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from '../auth/enums/index';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { query } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
// import { PoliciesGuard } from 'src/policies/policies-guard';
// import { createArticlePolicyHandler } from 'src/policies/article/article-category-policy-handler';
// import { CheckPolicies } from 'src/policies/check-policies.decorator';
import { CreateUserPolicyHandler } from '../casl/policy-handler/user/create-user-policy.handler';
import { CheckPolicies } from 'src/auth/decorators/check-policies.decorator';
import { UpdateUserPolicyHandler } from 'src/casl/policy-handler/user/update-user-policy.handler';

interface QueryParams {
  token: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateUserPolicyHandler)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOneByIdWithoutPassword(id);
  }

  // @Get('email/:id')
  // findOneByEmail(@Param('id') email: string) {
  //   return this.userService.getOneByEmail(email);
  // }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('reset/:token')
  async updatePassword(@Param('token') token: string, @Body() updatePassword: UpdatePasswordDto) {
    const { new_password } = updatePassword;
    return await this.userService.resetPassword(token, new_password);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  //forgot password
  @Post('forgot')
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;
    return await this.userService.forgotPassword(email);
  }

  //update user profile
  @Patch('profile/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateUserPolicyHandler)
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateProfileDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  //user permission
  @Get('permission/:id')
  @UseGuards(JwtAuthGuard)
  async getUserPermission(@Param('id') id: string) {
    return await this.userService.getUserPermission(id);
  }
}
