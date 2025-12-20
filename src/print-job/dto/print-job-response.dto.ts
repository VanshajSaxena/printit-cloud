import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JobResponseDto {
  @Expose()
  id: number;
}
