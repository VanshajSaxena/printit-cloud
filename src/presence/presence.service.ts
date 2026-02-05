import { Injectable } from '@nestjs/common';
import { UserStatus } from './enums/user-status.enum';

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
    return this.vendors.get(id)?.status ?? UserStatus.OFFLINE;
  }

  getStatusByUsername(username: string): UserStatus {
    const id = this.usernameToId.get(username);
    return id ? this.getStatusById(id) : UserStatus.OFFLINE;
  }

  getStatusBySlug(slug: string): UserStatus {
    const id = this.slugToId.get(slug);
    return id ? this.getStatusById(id) : UserStatus.OFFLINE;
  }

  markAway(vendorId: string) {
    const vendor = this.vendors.get(vendorId);
    if (vendor && vendor.status === UserStatus.ONLINE) {
      vendor.status = UserStatus.AWAY;
    }
  }

  getStatus(selector: string) {
    let status;
    if (selector.startsWith('@')) {
      status = this.getStatusByUsername(selector.substring(1));
    }
    if (/^\d+$/.test(selector)) {
      status = this.getStatusById(selector);
    }
    status = this.getStatusBySlug(selector);

    return { status };
  }

  getOnlineVendors(): string[] {
    return [...this.vendors.entries()]
      .filter(([, vendor]) => vendor.status === UserStatus.ONLINE)
      .map(([id]) => id);
  }
}
