import { Expose } from 'class-transformer';

export class PolicyDTO {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
