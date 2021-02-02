import slugify from 'slugify';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { PolicyDTO } from './policy.dto';

export class RoleDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  get slug(): string {
    return slugify(this.name);
  }

  @Type(() => PolicyDTO)
  @IsNotEmpty()
  @Expose()
  policies: PolicyDTO[];
}
