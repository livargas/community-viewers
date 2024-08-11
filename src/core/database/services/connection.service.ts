import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

@Injectable()
export class ConnectionService {
  constructor(private readonly configService: ConfigService) {}

  async getConnection(subdomain: string, entities: any[]): Promise<DataSource> {
    try {
      const dataSource = new DataSource({
        type: "mysql",
        host: this.configService.get<string>("MYSQL_HOST"),
        port: this.configService.get<number>("MYSQL_PORT"),
        username: this.configService.get<string>("MYSQL_USERNAME"),
        password: this.configService.get<string>("MYSQL_ROOT_PASSWORD"),
        database: `kc_${subdomain}`,
        entities,
      });

      return await dataSource.initialize();
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
