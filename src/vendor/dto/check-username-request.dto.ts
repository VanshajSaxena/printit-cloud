import { IsAlphanumeric, Length } from 'class-validator';

export class CheckUsernameRequestDto {
  @IsAlphanumeric()
  @Length(3, 20)
  username: string;
}
