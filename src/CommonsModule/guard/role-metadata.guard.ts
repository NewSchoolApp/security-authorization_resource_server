import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';

export const NeedRole = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);
