import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

/**
 * Custom decorator to apply authentication and role-based authorization
 * @param roles string[]
 */
export const Auth = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
};
