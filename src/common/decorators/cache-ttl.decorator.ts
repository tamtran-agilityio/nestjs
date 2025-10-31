import { SetMetadata } from '@nestjs/common';
export const CacheTTL = (ttl: number) => SetMetadata('custom:cacheTTL', ttl);
