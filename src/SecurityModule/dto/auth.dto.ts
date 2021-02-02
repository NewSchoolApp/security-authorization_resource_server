import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GrantTypeEnum } from '../enum/grant-type.enum';

export class AuthDTO {
  @IsEnum(GrantTypeEnum)
  @IsNotEmpty()
  // tslint:disable-next-line:variable-name
  grant_type: GrantTypeEnum;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line camelcase
  refresh_token?: string;
}
