import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class JoinVendorPayload {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class MilestoneTransactionPrinting {
  vendorId: number;
  transactionId: number;
  timestamp: string;
}

export class PresenceUpdate {
  presence: 'online' | 'offline' | 'away';
}

export class MilestoneTransactionQueued {
  vendorId: number;
  transactionId: number;
  timestamp: string;
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

export class JobStatusUpdatedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsNumber()
  jobId: number;

  @IsString()
  status: string;

  @IsString()
  timestamp: string;
}

export class JobCompletedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsNumber()
  jobId: number;

  @IsString()
  timestamp: string;
}

export class JobFailedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsNumber()
  jobId: number;

  @IsString()
  timestamp: string;
}

export class JobIncompletePayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsNumber()
  jobId: number;

  @IsOptional()
  @IsNumber()
  pagesPrinted?: number;

  @IsOptional()
  @IsNumber()
  totalPages?: number;

  @IsString()
  timestamp: string;
}

export class TransactionStatusUpdatedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsString()
  status: string;

  @IsString()
  timestamp: string;
}

export class TransactionCompletedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsString()
  timestamp: string;
}

export class TransactionFailedPayload {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  transactionId: number;

  @IsString()
  timestamp: string;
}
