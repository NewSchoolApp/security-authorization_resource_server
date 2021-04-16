import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class ChangePasswordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public findMany(args?: Prisma.ChangePasswordFindManyArgs) {
    return this.prismaService.changePassword.findMany(args);
  }

  public findUnique(args?: Prisma.ChangePasswordFindUniqueArgs) {
    return this.prismaService.changePassword.findUnique(args);
  }

  public findFirst(args?: Prisma.ChangePasswordFindFirstArgs) {
    return this.prismaService.changePassword.findFirst(args);
  }

  public create(args: Prisma.ChangePasswordCreateArgs) {
    return this.prismaService.changePassword.create(args);
  }

  public update(args: Prisma.ChangePasswordUpdateArgs) {
    return this.prismaService.changePassword.update(args);
  }

  public delete(args: Prisma.ChangePasswordDeleteArgs) {
    return this.prismaService.changePassword.delete(args);
  }
}
