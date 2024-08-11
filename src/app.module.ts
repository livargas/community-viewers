import { APP_GUARD } from '@nestjs/core';
import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';

import { EnvConfig } from "@core/config/env.config";
import { JoiValidationSchema } from "@core/config/joi.validation";
import { HealthModule } from "@core/health/health.module";
import { LoggerModule } from "@core/logger/logger.module";
import { DatabaseModule } from "@core/database/database.module";

import { AuthModule } from '@contexts/auth/auth.module';

import { ViewersModule } from '@contexts/viewers/viewers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    LoggerModule,
    HealthModule,
    AuthModule,
    DatabaseModule,
    ViewersModule,
  ]
})
export class AppModule {}
