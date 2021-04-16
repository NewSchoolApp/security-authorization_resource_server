import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { PolicyDTO } from './policy.dto';

export class RoleEntityDTO {
  @Expose()
  name: string;

  @Type(() => PolicyDTO)
  @IsNotEmpty()
  @Expose({ name: 'policies' })
  Policies: PolicyDTO[];
}
