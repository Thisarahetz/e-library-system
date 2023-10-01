import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResponseObject } from './interfaces/response-object.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResponseData, generateResponse } from 'src/utility/response.utill';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private usersService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache
  ) {}

  // validate user
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // decode token
  async decodeToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const payload: JwtPayload = decoded as JwtPayload;
      return payload;
    } catch (err) {
      return null;
    }
  }

  //generate token
  async generateToken(payload: JwtPayload, expiresIn: string = '1d') {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
    return token;
  }

  //verify token
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const payload: JwtPayload = decoded as JwtPayload;
      return payload;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  //authenticate
  async authenticate(dto: LoginUserDto): Promise<ResponseData<any>> {
    const { email, password } = dto;

    // Find the user in the database based on the provided EMAIL (should be unique)
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await this.usersService.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) throw new BadRequestException('User is not active');

    const userResponseData: AuthResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile_image: process.env.AWS_S3_URL + '/' + user.profileImage || null,
    };

    const jwtPayload: JwtPayload = { ...userResponseData };

    const accessToken = this.jwtService.sign(jwtPayload);

    //set response data
    const ResponseData = {
      token: accessToken,
      user: {
        ...userResponseData,
        userFeatureCategorys: user.userFeatureCategorys,
      },
    };

    return generateResponse(true, 200, 'Login successfully', {
      ...ResponseData,
    });

    // return {
    //   accessToken,
    //   ...userResponseData,
    // };;
  }

  async logout(token: string): Promise<ResponseObject> {
    const accessToken = token.replace('Bearer ', '');

    const isBlockListed = await this.cacheService.get(accessToken);

    if (isBlockListed) {
      throw new UnauthorizedException();
    }

    await this.cacheService.set(accessToken, accessToken, 60 * 60 * 24);
    return {
      status: 'success',
      message: "You've been logged out!",
    };
  }
}
