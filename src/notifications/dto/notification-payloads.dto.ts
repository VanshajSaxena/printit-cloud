import { IsIn, IsNotEmpty, IsInt } from 'class-validator';

export class JoinVendorPayload {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class JoinTransactionPayload {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class NewTransactionPayload {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class UpdateProgressPayload {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsIn(['pending', 'queued', 'printing', 'completed', 'error'])
  @IsNotEmpty()
  progress: 'pending' | 'queued' | 'printing' | 'completed' | 'error';
}
