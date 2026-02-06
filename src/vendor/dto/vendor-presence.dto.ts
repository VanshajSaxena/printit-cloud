import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from 'src/presence/enums/user-status.enum';

@Exclude()
export class VendorPresenceDto {
  @Expose()
  status: UserStatus;

  @Expose()
  id: number;

  constructor(partial: Partial<VendorPresenceDto>) {
    Object.assign(this, partial);
  }
}
