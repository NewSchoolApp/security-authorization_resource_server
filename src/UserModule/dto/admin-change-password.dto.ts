import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  confirmNewPassword: string;
}
