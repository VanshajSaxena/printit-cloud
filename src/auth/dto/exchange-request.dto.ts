import { IsUUID } from 'class-validator';

export class ExchangeRequestDto {
  @IsUUID()
  code: string;
}
