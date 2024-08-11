import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("PASSPORT_PUBLIC_KEY"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;
    const user = await this.userRepository.findOneBy({ id: userId });

    console.log('estretia validate')
    if (!user) {
        throw new UnauthorizedException("Access Token not valid.");
    }
    
    return user;
  }
}
