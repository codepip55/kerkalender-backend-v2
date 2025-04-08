import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { LoggingFilter } from './utils/logging.filter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { EmailModule } from './email/email.module';
import { SetlistsModule } from './setlists/setlists.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    EmailModule,
    SetlistsModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: LoggingFilter,
    },
  ],
})
export class AppModule {}
