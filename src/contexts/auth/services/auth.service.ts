import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { WsException } from "@nestjs/websockets";
import { ConnectionService } from '@core/database/services/connection.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly connectionService: ConnectionService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(token: string, subdomain: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("PASSPORT_PUBLIC_KEY"),
      });

      const { sub: userId } = payload;
      return await this.validateUser(userId, subdomain);
    } catch (error: any) {
      Logger.error(error.message, "AuthService.verifyToken");
      throw new WsException("Unauthorized: No token provided");
      return null;
    }
  }

  async validateUser(id: string, subdomain: string) {
    try {  
      const connection = await this.connectionService.getConnection(subdomain, [User]);
      if (!connection) return null;
      const user = await connection.getRepository(User).findOneByOrFail({ id });
      connection.destroy();
      return user;
    } catch (error: any) {
      Logger.error(error.message, "AuthService.validateUser");
      throw new WsException("Unauthorized: validateUser failed");
      return null;
    }
  }
}
