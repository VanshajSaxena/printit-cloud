import { IsString } from 'class-validator';

export class ExchangeRequestDto {
  @IsString()
  code: string;
}
