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

@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.id);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(client.id);
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
    this.server.to(`vendor-${vendorId}`).emit('new_transaction', payload);
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
