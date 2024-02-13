import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ActivitiesModule } from './modules/activities/activities.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Token } from './modules/activities/entities/token.entity';
import { Activity } from './modules/activities/entities/activity.entity';
import { ScheduleModule } from '@nestjs/schedule';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [Token, Activity],
    }),
    ActivitiesModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
