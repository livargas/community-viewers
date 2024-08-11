import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModuleOptions, JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./services/auth.service";
import { AuthController } from "./api/auth.controller";
import { User } from "./entities/user.entity";
import { JwtStrategy } from "./strategies/jw.strategy";
import { DatabaseModule } from '@core/database/database.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get<string>("PASSPORT_PRIVATE_KEY"),
          publicKey: configService.get<string>("PASSPORT_PUBLIC_KEY"),
          signOptions: {
            expiresIn: "3a",
            algorithm: "RS256",
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    DatabaseModule
  ],
  exports: [AuthService, PassportModule, TypeOrmModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
