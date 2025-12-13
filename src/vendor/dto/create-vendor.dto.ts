import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  givenName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEmail()
  @IsString()
  email: string;
}
