import { Injectable } from '@nestjs/common';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { VendorPresenceDto } from 'src/vendor/dto/vendor-presence.dto';
import { UserStatus } from './enums/user-status.enum';

export interface VendorPresencePayload {
  id: string;
  username: string;
}

interface Vendor {
  sockets: Set<string>;
  status: UserStatus;
  username: string;
}

@Injectable()
export class PresenceService {
  private readonly vendors = new Map<string, Vendor>();
  private readonly socketToVendor = new Map<string, string>();
  private readonly usernameToId = new Map<string, string>();

  constructor(private readonly logger: ApplicationLogger) {
    this.logger.setContext(PresenceService.name);
  }

  vendorConnected(payload: VendorPresencePayload, socketId: string) {
    const { id, username } = payload;

    let vendor = this.vendors.get(id);
    if (!vendor) {
      vendor = {
        sockets: new Set(),
        status: UserStatus.OFFLINE,
        username,
      };
      this.vendors.set(id, vendor);

      this.usernameToId.set(username, id);
    } else {
      if (vendor.username !== username) {
        this.usernameToId.delete(vendor.username);
        this.usernameToId.set(username, id);
        vendor.username = username;
      }
    }

    vendor.sockets.add(socketId);
    this.socketToVendor.set(socketId, id);

    vendor.status = UserStatus.ONLINE;
  }

  vendorDisconnected(socketId: string) {
    const vendorId = this.socketToVendor.get(socketId);
    if (!vendorId) return;

    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      this.socketToVendor.delete(socketId);
      return;
    }

    vendor.sockets.delete(socketId);
    this.socketToVendor.delete(socketId);

    if (vendor.sockets.size === 0) {
      vendor.status = UserStatus.OFFLINE;
      this.usernameToId.delete(vendor.username);
      this.vendors.delete(vendorId);
    }
  }

  getStatusById(id: string): UserStatus {
    const status = this.vendors.get(id)?.status ?? UserStatus.OFFLINE;
    return status;
  }

  getStatusByUsername(username: string): UserStatus {
    const id = this.usernameToId.get(username);
    return id ? this.getStatusById(id) : UserStatus.OFFLINE;
  }

  markAway(socketId: string) {
    const vendorId = this.socketToVendor.get(socketId);
    if (!vendorId) return;
    const vendor = this.vendors.get(vendorId);
    if (vendor && vendor.status === UserStatus.ONLINE) {
      vendor.status = UserStatus.AWAY;
      this.logger.log(
        `Client ${socketId} presence vendor ${vendorId} updated to: away`,
      );
    }
  }

  markOnline(socketId: string) {
    const vendorId = this.socketToVendor.get(socketId);
    if (!vendorId) return;
    const vendor = this.vendors.get(vendorId);
    if (vendor && vendor.status !== UserStatus.ONLINE) {
      vendor.status = UserStatus.ONLINE;
      this.logger.log(
        `Client ${socketId} presence vendor ${vendorId} updated to: online`,
      );
    }
  }

  markOffline(socketId: string) {
    const vendorId = this.socketToVendor.get(socketId);
    if (!vendorId) return;
    const vendor = this.vendors.get(vendorId);
    if (vendor && vendor.status !== UserStatus.OFFLINE) {
      vendor.status = UserStatus.OFFLINE;
      this.logger.log(
        `Client ${socketId} presence vendor ${vendorId} updated to: offline`,
      );
    }
  }

  getStatus(selector: string) {
    let status;
    if (selector.startsWith('@')) {
      status = this.getStatusByUsername(selector.substring(1));
      return new VendorPresenceDto({
        status,
        id: Number(this.usernameToId.get(selector.substring(1))),
      });
    } else {
      status = this.getStatusById(selector);
      return new VendorPresenceDto({ status, id: Number(selector) });
    }
  }

  getOnlineVendors(): string[] {
    return [...this.vendors.entries()]
      .filter(([, vendor]) => vendor.status === UserStatus.ONLINE)
      .map(([id]) => id);
  }
}
