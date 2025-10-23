import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Access token is required');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.jwtService['options'].secret,
            });
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers['authorization'];
        if (!authHeader) return null;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}