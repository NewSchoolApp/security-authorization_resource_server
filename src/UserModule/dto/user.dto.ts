import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto/role.dto';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  enabled: boolean;

  @Type(() => RoleDTO)
  @IsNotEmpty()
  @Expose()
  Role: RoleDTO;
}
