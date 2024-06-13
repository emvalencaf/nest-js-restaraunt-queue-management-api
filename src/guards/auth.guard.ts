import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserType } from '../enums/user-type.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { AuthCustomerSignInPayloadDTO } from '../auth/dtos/auth-customer-sign-in-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException('Token not found');

        try {
            const payload: AuthCustomerSignInPayloadDTO =
                await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });

            if (!payload || !payload.userType) {
                throw new UnauthorizedException('Invalid token payload');
            }

            return requiredRoles.some((role) => role === payload.userType);
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
