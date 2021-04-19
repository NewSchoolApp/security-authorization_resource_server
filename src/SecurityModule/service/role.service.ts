import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repository/role.repository';
import { ErrorObject } from '../../CommonsModule/dto/error-object.dto';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  public async findByRoleName(name: string) {
    const role = await this.repository.findByRoleName(name);
    if (!role) {
      throw new NotFoundException(new ErrorObject('ROLE_NOT_FOUND'));
    }
    return role;
  }
}
