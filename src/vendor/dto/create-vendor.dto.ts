import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  sub: string;
}
