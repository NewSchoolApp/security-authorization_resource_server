import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public findMany(args?: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(args);
  }

  public findUnique(args?: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(args);
  }

  public findFirst(args?: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }

  public create(args: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(args);
  }

  public update(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args);
  }

  public delete(args: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(args);
  }

  public findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { Role: { include: { Policies: true } } },
    });
  }

  public async findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
      include: { Role: { include: { Policies: true } } },
    });
  }

  public async findByEmailAndFacebookId(
    email: string,
    facebookId: string,
  ): Promise<User> {
    return this.prismaService.user.findFirst({ where: { email, facebookId } });
  }
}
