import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Register the enum with GraphQL
registerEnumType(Role, {
  name: 'Role',
  description: 'User roles in the system',
  valuesMap: {
    ADMIN: {
      description: 'Administrator with full access',
    },
    USER: {
      description: 'Regular user with limited access',
    },
    MODERATOR: {
      description: 'Moderator with content management access',
    },
  },
});
