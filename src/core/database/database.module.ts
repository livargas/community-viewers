import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionService } from "./services/connection.service";

@Module({
  providers: [ConnectionService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("MYSQL_HOST"),
        port: configService.get<number>("MYSQL_PORT"),
        username: configService.get<string>("MYSQL_USERNAME"),
        password: configService.get<string>("MYSQL_ROOT_PASSWORD"),
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule, ConnectionService],
})
export class DatabaseModule {}
