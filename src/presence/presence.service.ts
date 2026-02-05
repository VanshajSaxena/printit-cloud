import { Injectable } from '@nestjs/common';
import { UserStatus } from './enums/user-status.enum';
import { ApplicationLogger } from 'src/logger/application-logger.service';

export interface VendorPresencePayload {
  id: string;
  username: string;
  slug: string;
}

interface Vendor {
  sockets: Set<string>;
  status: UserStatus;
  username: string;
  slug: string;
}

@Injectable()
export class PresenceService {
  private readonly vendors = new Map<string, Vendor>();
  private readonly socketToVendor = new Map<string, string>();
  private readonly usernameToId = new Map<string, string>();
  private readonly slugToId = new Map<string, string>();

  constructor(private readonly logger: ApplicationLogger) {}

  vendorConnected(payload: VendorPresencePayload, socketId: string) {
    const { id, username, slug } = payload;

    let vendor = this.vendors.get(id);
    if (!vendor) {
      vendor = {
        sockets: new Set(),
        status: UserStatus.OFFLINE,
        username,
        slug,
      };
      this.vendors.set(id, vendor);

      this.usernameToId.set(username, id);
      this.slugToId.set(slug, id);
    } else {
      if (vendor.username !== username) {
        this.usernameToId.delete(vendor.username);
        this.usernameToId.set(username, id);
        vendor.username = username;
      }
      if (vendor.slug !== slug) {
        this.slugToId.delete(vendor.slug);
        this.slugToId.set(slug, id);
        vendor.slug = slug;
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
      this.slugToId.delete(vendor.slug);
      this.vendors.delete(vendorId);
    }
  }

  getStatusById(id: string): UserStatus {
    const status = this.vendors.get(id)?.status ?? UserStatus.OFFLINE;
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService#getStatusById status:', status); // __AUTO_GENERATED_PRINT_VAR_END__
    return status;
  }

  getStatusByUsername(username: string): UserStatus {
    const id = this.usernameToId.get(username);
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService#getStatusByUsername id:', id); // __AUTO_GENERATED_PRINT_VAR_END__
    return id ? this.getStatusById(id) : UserStatus.OFFLINE;
  }

  getStatusBySlug(slug: string): UserStatus {
    const id = this.slugToId.get(slug);
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService#getStatusBySlug id:', id); // __AUTO_GENERATED_PRINT_VAR_END__
    return id ? this.getStatusById(id) : UserStatus.OFFLINE;
  }

  markAway(vendorId: string) {
    const vendor = this.vendors.get(vendorId);
    if (vendor && vendor.status === UserStatus.ONLINE) {
      vendor.status = UserStatus.AWAY;
    }
  }

  getStatus(selector: string) {
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService#getStatus selector:', selector); // __AUTO_GENERATED_PRINT_VAR_END__
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService vendors:', this.vendors); // __AUTO_GENERATED_PRINT_VAR_END__
    let status;
    if (selector.startsWith('@')) {
      status = this.getStatusByUsername(selector.substring(1));
      // __AUTO_GENERATED_PRINT_VAR_START__
      this.logger.log('PresenceService#getStatus#if username:', status); // __AUTO_GENERATED_PRINT_VAR_END__
    }
    if (/^\d+$/.test(selector)) {
      status = this.getStatusById(selector);
      // __AUTO_GENERATED_PRINT_VAR_START__
      this.logger.log('PresenceService#getStatus#if id:', status); // __AUTO_GENERATED_PRINT_VAR_END__
    }
    status = this.getStatusBySlug(selector);
    // __AUTO_GENERATED_PRINT_VAR_START__
    this.logger.log('PresenceService#getStatus slug:', status); // __AUTO_GENERATED_PRINT_VAR_END__

    return { status };
  }

  getOnlineVendors(): string[] {
    return [...this.vendors.entries()]
      .filter(([, vendor]) => vendor.status === UserStatus.ONLINE)
      .map(([id]) => id);
  }
}
