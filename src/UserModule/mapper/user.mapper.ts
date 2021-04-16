import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDTO } from '../dto/user.dto';
import { Mapper } from '../../CommonsModule/mapper/mapper';
import { UserEntityDTO } from '../dto/user-entity.dto';

@Injectable()
export class UserMapper extends Mapper<User, UserDTO> {
  constructor() {
    super(UserEntityDTO, UserDTO);
  }

  toDto(entityObject: User): UserDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: User[]): UserDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: UserDTO): User {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: UserDTO[]): User[] {
    return super.toEntityList(dtoArray);
  }
}
