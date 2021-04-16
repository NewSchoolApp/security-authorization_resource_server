import { User } from '@prisma/client';
import { RoleEntityDTO } from '../../SecurityModule/dto/role-entity.dto';
import { Expose } from "class-transformer";

export class UserEntityDTO implements User {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  username: string;
  password: string;
  @Expose()
  roleId: string;
  @Expose()
  enabled: boolean;
  @Expose()
  phone: string | null;
  @Expose()
  email: string | null;
  facebookId: string | null;
  googleSub: string | null;
  @Expose({ name: 'role' })
  Role: RoleEntityDTO;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
