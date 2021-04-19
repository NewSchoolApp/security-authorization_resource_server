import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
