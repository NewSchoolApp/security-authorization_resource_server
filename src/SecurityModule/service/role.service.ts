import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repository/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  public async findByRoleName(name: string) {
    const role = await this.repository.findByRoleName(name);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
