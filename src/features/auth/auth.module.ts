import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from '../../common/strategies/basic.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { BcryptService } from '../../base/bcrypt.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const apiSettings = configService.get('apiSettings', {
          infer: true,
        });
        return {
          secret: apiSettings.JWT_SECRET,
          signOptions: { expiresIn: apiSettings.ACCESS_TOKEN_EXPIRATION },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BasicStrategy, LocalStrategy, BcryptService],
})
export class AuthModule {}
