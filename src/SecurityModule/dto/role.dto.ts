import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { PolicyDTO } from './policy.dto';

export class RoleDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Type(() => PolicyDTO)
  @IsNotEmpty()
  @Expose()
  Policies: PolicyDTO[];
}
