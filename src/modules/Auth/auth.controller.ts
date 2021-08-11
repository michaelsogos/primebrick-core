import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { GlobalRpcAction } from 'primebrick-sdk/enums';
import { AuthTokenPayload } from 'primebrick-sdk/models';
import { ProcessorManagerService } from 'primebrick-sdk/modules';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly processorManagerService: ProcessorManagerService) {}

    @Post('login')
    async login(@Body() credentials: { username: string; password: string }): Promise<AuthTokenPayload> {
        const response = await this.processorManagerService.sendMessage<{ username: string; password: string }, AuthTokenPayload>(
            GlobalRpcAction.AUTH_LOGIN,
            credentials,
        );

        return response.data;
    }

    @Post('refresh_token')
    async refreshToken(@Body() body: { refresh_token: string }, @Headers('authorization') accessToken: string): Promise<AuthTokenPayload> {
        if (!accessToken) throw new UnauthorizedException('Authorization header missing!');

        const access_token = accessToken.split(' ')[1];
        if (!access_token) throw new UnauthorizedException('Authorization bearer token malformed!');

        // return await this.authService.refreshToken(tenantAlias, body.refresh_token, access_token);

        const response = await this.processorManagerService.sendMessage<{ refresh_token: string; access_token: string }, AuthTokenPayload>(
            GlobalRpcAction.AUTH_REFRESH_TOKEN,
            { refresh_token: body.refresh_token, access_token },
        );

        return response.data;
    }

    /*   @Post('update-password')
  async updatePassword(@Tenant() tenantAlias: string, @Body()  newCredentials : {username: string, password : string}){
    return await this.authService.updateUserPassword(tenantAlias, newCredentials );
  } */
}
