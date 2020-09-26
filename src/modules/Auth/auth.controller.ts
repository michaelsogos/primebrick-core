import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokenPayload } from './models/AuthTokenPayload';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() credentials: { username: string; password: string }): Promise<AuthTokenPayload> {
        return await this.authService.login(credentials);
    }

    @Post('refresh_token')
    async refreshToken(@Body() body: { refresh_token: string }, @Headers('authorization') accessToken: string): Promise<AuthTokenPayload> {
        if (!accessToken) throw new UnauthorizedException('Authorization header missing!');

        const access_token = accessToken.split(' ')[1];
        if (!access_token) throw new UnauthorizedException('Authorization bearer token malformed!');

        return await this.authService.refreshToken(body.refresh_token, access_token);
    }
}
