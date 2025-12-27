import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateJobResponseDto {
  @Expose()
  id: number;
}
