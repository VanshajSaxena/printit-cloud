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

@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  constructor(private logger: ApplicationLogger) {
    this.logger.setContext(NotificationsGateway.name);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log('Client Connected', [client.id]);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log('Client Disconnected', [client.id]);
  }

  @SubscribeMessage('join_vendor')
  async handleJoinVendor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinVendorPayload,
  ): Promise<void> {
    await client.join(`vendor-${payload.id}`);
  }

  @SubscribeMessage('join_transaction')
  async handleJoinTransaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinTransactionPayload,
  ): Promise<void> {
    await client.join(`transaction-${payload.id}`);
  }

  sendNewTransactionToVendor(
    vendorId: number,
    payload: NewTransactionPayload,
  ): void {
    this.server.to(`vendor-${vendorId}`).emit('transaction:new', payload);
  }

  sendUpdatesToCustomer(
    transactionId: number,
    payload: UpdateProgressPayload,
  ): void {
    this.server
      .to(`transaction-${transactionId}`)
      .emit('update_progress', payload);
  }
}
