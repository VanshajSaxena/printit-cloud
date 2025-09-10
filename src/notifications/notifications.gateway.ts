import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {}
  handleDisconnect(@ConnectedSocket client: Socket) {}

  @SubscribeMessage('join_vendor')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {}

  @SubscribeMessage('new_transaction')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {}

  @SubscribeMessage('join_transaction')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {}

  @SubscribeMessage('update_progress')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {}
}
