import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class JoinVendorPayload {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class JoinTransactionPayload {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class NewTransactionPayload {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class UpdateProgressPayload {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsIn(['pending', 'queued', 'printing', 'completed', 'error'])
  @IsNotEmpty()
  progress: 'pending' | 'queued' | 'printing' | 'completed' | 'error';
}
