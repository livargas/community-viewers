import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from '@core/database/database.module';
import { AuthModule } from "../auth/auth.module";

import { ViewersGateway } from "./viewers.gateway";
import { ViewersService } from "./services/viewers.service";
import { ActivityViewer } from "./entities/activity-viewer.entity";
import { ActivityUser } from "./entities/activity-user.entity";

@Module({
  providers: [ViewersGateway, ViewersService],
  imports: [
    AuthModule,
    DatabaseModule,
    TypeOrmModule.forFeature([ActivityViewer, ActivityUser]),
  ],
})
export class ViewersModule {}
