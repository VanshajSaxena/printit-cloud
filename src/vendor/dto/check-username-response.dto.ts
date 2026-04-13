import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CheckUsernameResponseDto {
  @Expose()
  available: boolean;

  constructor(partial: Partial<CheckUsernameResponseDto>) {
    Object.assign(this, partial);
  }
}
