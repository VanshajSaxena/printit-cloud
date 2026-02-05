import { Injectable } from '@nestjs/common';

export type UserStatus = 'online' | 'offline' | 'away';

@Injectable()
export class PresenceService {
  private readonly vendorToSockets = new Map<string, Set<string>>();
  private readonly socketToVendor = new Map<string, string>();
  private readonly vendorStatus = new Map<string, UserStatus>();

  vendorConnected(userId: string, socketId: string) {
    let sockets = this.vendorToSockets.get(userId);

    if (!sockets) {
      sockets = new Set();
      this.vendorToSockets.set(userId, sockets);
    }

    sockets.add(socketId);
    this.socketToVendor.set(socketId, userId);

    if (sockets.size === 1) {
      this.vendorStatus.set(userId, 'online');
    }
  }

  vendorDisconnected(socketId: string) {
    const userId = this.socketToVendor.get(socketId);
    if (!userId) return;

    const sockets = this.vendorToSockets.get(userId);
    if (!sockets) return;

    sockets.delete(socketId);
    this.socketToVendor.delete(socketId);

    if (sockets.size === 0) {
      this.vendorToSockets.delete(userId);
      this.vendorStatus.set(userId, 'offline');
    }
  }

  getUserStatus(userId: string) {
    return this.vendorStatus.get(userId) ?? 'offline';
  }

  getOnlineUsers() {
    return [...this.vendorStatus.entries()]
      .filter(([, status]) => status === 'online')
      .map(([userId]) => userId);
  }
}
