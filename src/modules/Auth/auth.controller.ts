import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tenant } from 'primebrick-sdk';
import { AuthTokenPayload } from './models/AuthTokenPayload';
import { TenantAlias } from 'primebrick-sdk/dist/modules/TenantManager/entities/TenantAlias.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Tenant() tenantAlias: string, @Body() credentials: { username: string; password: string }): Promise<AuthTokenPayload> {
    return await this.authService.login(tenantAlias, credentials);
  }

  @Post('refresh_token')
  async refreshToken(@Tenant() tenantAlias: string, @Body() body: { refresh_token: string }, @Headers('authorization') accessToken: string): Promise<AuthTokenPayload> {
    if (!accessToken) throw new UnauthorizedException('Authorization header missing!');

    const access_token = accessToken.split(' ')[1];
    if (!access_token) throw new UnauthorizedException('Authorization bearer token malformed!');

    return await this.authService.refreshToken(tenantAlias, body.refresh_token, access_token);
  }

/*   @Post('update-password')
  async updatePassword(@Tenant() tenantAlias: string, @Body()  newCredentials : {username: string, password : string}){
    return await this.authService.updateUserPassword(tenantAlias, newCredentials );
  } */
}
