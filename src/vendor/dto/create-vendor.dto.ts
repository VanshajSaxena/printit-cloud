import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  sub: string;
}
