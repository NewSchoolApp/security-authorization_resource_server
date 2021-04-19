import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class NewUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  roleName: string;

  @IsBoolean()
  enabled = true;

  @IsString()
  facebookId?: string;

  @IsString()
  googleSub?: string;
}
