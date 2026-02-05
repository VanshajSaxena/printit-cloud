import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  JoinTransactionPayload,
  JoinVendorPayload,
  NewTransactionPayload,
  UpdateProgressPayload,
} from './dto/notification-payloads.dto';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { corsOptions } from 'src/corsOptions';
import { PresenceService } from 'src/presence/presence.service';
import { isValidClient, SocketAuthPayload } from './isValidClient';

@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'notifications', cors: corsOptions })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  constructor(
    private logger: ApplicationLogger,
    private presenceService: PresenceService,
  ) {
    this.logger.setContext(NotificationsGateway.name);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const auth = socket.handshake.auth as Partial<SocketAuthPayload>;
    this.logger.log('NotificationsGateway#handleConnection:', auth);

    if (!isValidClient(auth)) {
      socket.disconnect();
      return;
    }

    const { clientType, clientId } = auth;

    if (clientType === 'vendor') {
      this.presenceService.vendorConnected(clientId, socket.id);
    }

    this.logger.log(`Client connected: ${clientType} (${socket.id})`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const auth = socket.handshake.auth as Partial<SocketAuthPayload>;
    this.logger.log('NotificationsGateway#handleDisconnection:', auth);

    if (!isValidClient(auth)) {
      socket.disconnect();
      return;
    }

    const { clientType } = auth;

    if (clientType === 'vendor') {
      this.presenceService.vendorDisconnected(socket.id);
    }

    this.logger.log(`Client disconnected: ${clientType} (${socket.id})`);
  }

  @SubscribeMessage('join_vendor')
  async handleJoinVendor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinVendorPayload,
  ): Promise<void> {
    await client.join(`vendor:${payload.id}`);
  }

  @SubscribeMessage('join_transaction')
  async handleJoinTransaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinTransactionPayload,
  ): Promise<void> {
    await client.join(`transaction:${payload.id}`);
  }

  sendNewTransactionToVendor(
    vendorId: number,
    payload: NewTransactionPayload,
  ): void {
    this.server.to(`vendor:${vendorId}`).emit('transaction:new', payload);
  }

  sendUpdatesToCustomer(
    transactionId: number,
    payload: UpdateProgressPayload,
  ): void {
    this.server
      .to(`transaction:${transactionId}`)
      .emit('update_progress', payload);
  }
}
