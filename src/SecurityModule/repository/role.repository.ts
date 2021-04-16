import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByRoleName(name: string): Promise<Role> {
    return this.prismaService.role.findUnique({ where: { name } });
  }
}
