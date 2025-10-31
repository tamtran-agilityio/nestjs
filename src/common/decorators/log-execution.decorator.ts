import { SetMetadata } from '@nestjs/common';

export const LogExecution = (isEnabled: boolean) =>
  SetMetadata('custom:logExecution', isEnabled);
