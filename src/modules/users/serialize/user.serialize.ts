// src/modules/users/serialize/user.serialize.ts
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerialize {
  @Expose()
  id: number;

  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  age: number;

  // Explicitly exclude sensitive fields
  @Expose({ groups: ['admin'] })
  isActive: boolean;

  @Expose({ groups: ['admin'] })
  roles: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Explicitly exclude sensitive fields
  @Exclude()
  password: string;

  constructor(partial: Partial<UserSerialize>) {
    Object.assign(this, partial);
  }
}
