import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TenantRepositoryService, TenantManagerService, LocalAuthConfig, UserProfile } from 'primebrick-sdk';
import { User } from './entities/User.entity';
import { Login } from './entities/Login.entity';
import { AuthTokenPayload } from './models/AuthTokenPayload';
import { AuthManagerHelper } from 'primebrick-sdk';

@Injectable()
export class AuthService {
    constructor(private readonly repositoryService: TenantRepositoryService, private readonly tenantService: TenantManagerService) {}

    async login(tenantAlias: string, credentials: { username: string; password: string }): Promise<AuthTokenPayload> {
        try {
            const tenant = this.tenantService.getTenantConfig(tenantAlias);
            const authConfig: LocalAuthConfig = tenant.tenant_auth_config.auth_config;

            let user: User = null;
            switch (tenant.tenant_auth_config.auth_type) {
                case 'local':
                    {
                        user = await this.localAuthenticate(tenantAlias, credentials);
                    }
                    break;
                case 'oauth2':
                    throw new NotImplementedException();
                case 'saml2':
                    throw new NotImplementedException();
            }

            const access_token = jwt.sign(Object.assign({}, this.createUserProfileFromUser(user)), authConfig.secretKey, {
                audience: [`tenant:${tenant.code}`],
                issuer: 'primebrick',
                expiresIn: authConfig.tokenExpiresIn || '15m',
            });

            const refresh_token = jwt.sign({}, authConfig.secretKey, {
                audience: [`tenant:${tenant.code}`],
                issuer: 'primebrick',
                expiresIn: authConfig.sessionExpiresIn || '1d',
            });

            const access_token_payload = jwt.decode(access_token);

            const payload = new AuthTokenPayload();
            payload.access_token = access_token;
            payload.refresh_token = refresh_token;
            payload.token_type = 'Bearer';
            payload.expires_in = (access_token_payload['exp'] as number) - (access_token_payload['iat'] as number);

            return payload;
        } catch (ex) {
            throw new UnauthorizedException('Credentials are invalid!');
        }
    }

    async refreshToken(tenantAlias: string, refreshToken: string, accessToken: string): Promise<AuthTokenPayload> {
        const tenant = this.tenantService.getTenantConfig(tenantAlias);
        const authConfig: LocalAuthConfig = tenant.tenant_auth_config.auth_config;

        switch (tenant.tenant_auth_config.auth_type) {
            case 'local': {
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, authConfig.secretKey, {
                        issuer: 'primebrick',
                        audience: `tenant:${tenant.code}`,
                    });
                    const decodedAccessToken = jwt.verify(accessToken, authConfig.secretKey, {
                        issuer: 'primebrick',
                        audience: `tenant:${tenant.code}`,
                        ignoreExpiration: true,
                    }) as UserProfile;

                    const userProfile = this.createUserProfileFromUser(await this.getUserProfile(tenantAlias, decodedAccessToken.code));

                    const access_token = jwt.sign(Object.assign({}, userProfile), authConfig.secretKey, {
                        audience: [`tenant:${tenant.code}`],
                        issuer: 'primebrick',
                        expiresIn: authConfig.tokenExpiresIn || '15m',
                    });

                    const refresh_token = jwt.sign(
                        { exp: decodedRefreshToken['exp'], aud: decodedRefreshToken['aud'], iss: decodedRefreshToken['iss'] },
                        authConfig.secretKey,
                    );

                    const access_token_payload = jwt.decode(access_token);

                    const payload = new AuthTokenPayload();
                    payload.access_token = access_token;
                    payload.refresh_token = refresh_token;
                    payload.token_type = 'Bearer';
                    payload.expires_in = (access_token_payload['exp'] as number) - (access_token_payload['iat'] as number);

                    return payload;
                } catch (ex) {
                    throw new UnauthorizedException('Authorization refresh token is not valid!');
                }
            }
            case 'oauth2':
                throw new NotImplementedException();
            case 'saml2':
                throw new NotImplementedException();
        }
    }

    private async localAuthenticate(tenantAlias: string, credentials: { username: string; password: string }): Promise<User> {
        const loginRepository = await this.repositoryService.getTenantRepository(tenantAlias, Login);

        const userLogIn = await loginRepository.findOneOrFail(null, {
            where: { username: credentials.username },
            relations: ['user'],
        });

        const securePassword = AuthManagerHelper.secureStringReader(userLogIn.password);

        const secureString = AuthManagerHelper.buildSecureString(credentials.password, securePassword.salt, securePassword.iterations);

        if (secureString == userLogIn.password) return userLogIn.user;
        else throw new UnauthorizedException('Credentials are invalid!');
    }

    private async getUserProfile(tenantAlias: string, userCode: string): Promise<User> {
        const loginRepository = await this.repositoryService.getTenantRepository(tenantAlias, User);
        const user = await loginRepository.findOneOrFail({
            where: {
                code: userCode,
            },
        });

        return user;
    }

    private createUserProfileFromUser(user: User): UserProfile {
        const userProfile = new UserProfile();
        userProfile.code = user.code;
        userProfile.email = user.email;
        userProfile.firstName = user.firstName;
        userProfile.lastName = user.lastName;
        userProfile.languageCode = user.languageCode;
        userProfile.roles = user.roles.map((role) => role.name);

        return userProfile;
    }

/*     async updateUserPassword(tenantAlias: string, newCredentials : {username : string, password : string }){
        const loginRepository = await this.repositoryService.getTenantRepository(tenantAlias, Login);

        const userLogIn = await loginRepository.findOneOrFail(null, {
            where: { username: newCredentials.username },
            relations: ['user'],
        });

        const crypto = require('crypto');
        
        const salt = crypto.randomBytes(128).toString("base64");

        const iterations = 48000;

        const newPassword = AuthManagerHelper.buildSecureString(newCredentials.password, salt, iterations);
        
        userLogIn.password = newPassword;

        loginRepository.save(userLogIn);

        
    } */
}
