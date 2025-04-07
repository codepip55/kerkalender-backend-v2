import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { Strategy } from 'passport-oauth2';
import { firstValueFrom } from 'rxjs';

import { UsersService } from '../../users/users.service';

@Injectable()
export class KerkalenderStrategy extends PassportStrategy(
  Strategy,
  'kerkalender',
) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private http: HttpService,
  ) {
    super({
      authorizationURL: configService.get<string>('KERKALENDER_AUTH_AUTH_URL'),
      tokenURL: configService.get<string>('KERKALENDER_AUTH_TOKEN_URL'),
      clientID: configService.get<string>('KERKALENDER_AUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('KERKALENDER_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KERKALENDER_AUTH_CALLBACK_URL'),
      scope: '',
    });
  }

  async validate(accessToken: string, refreshToken: string): Promise<any> {
    const userURL = this.configService.get<string>(
      'KERKALENDER_AUTH_USER_INFO_URL',
    );
    const user$ = this.http.get(userURL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const response = await firstValueFrom(user$);

    // Update user or create if none exists
    let user = null;
    try {
      user = await this.usersService.findByCidAndUpdate(response.data.cid, {
          cid: response.data.cid,
          nameFull: response.data.name,
        },
      );
    } catch (err) {
      if (err instanceof NotFoundException) {
        user = await this.usersService.createUser({
          cid: response.data.cid,
          nameFull: response.data.name,
        });
      } else {
        throw err;
      }
    }

    return { user, refreshToken };
  }

  authenticate(req: Request, options: any): any {
    const { state } = req.query;
    super.authenticate(req, { ...options, state });
  }
}
