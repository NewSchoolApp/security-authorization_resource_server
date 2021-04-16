import { Injectable } from '@nestjs/common';
import { ClientCredentials } from '@prisma/client';
import { PrismaService } from '../../PrismaModule/service/prisma.service';

@Injectable()
export class ClientCredentialsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByNameAndSecret(
    name: string,
    secret: string,
  ): Promise<ClientCredentials | undefined> {
    return this.prismaService.clientCredentials.findFirst({
      where: { name, secret },
    });
  }
}
