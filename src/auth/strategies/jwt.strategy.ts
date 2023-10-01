import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly userRepo: UserService, @Inject(CACHE_MANAGER) private cacheService: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        _: Request,
        rawJwtToken: any,
        done: (err: any, secretOrKey?: string | Buffer) => void
      ) => {
        const isBlockListed = await this.cacheService.get(rawJwtToken);

        if (isBlockListed) {
          done(new UnauthorizedException());
        } else {
          done(null, process.env.JWT_SECRET);
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userRepo.findOneById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
