import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { corsOptions } from 'src/corsOptions';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { PresenceService } from 'src/presence/presence.service';
import {
  JobCompletedPayload,
  JobFailedPayload,
  JobIncompletePayload,
  JobStatusUpdatedPayload,
  JoinTransactionPayload,
  JoinVendorPayload,
  MilestoneTransactionPrinting,
  MilestoneTransactionQueued,
  NewTransactionPayload,
  PresenceUpdate,
  TransactionCompletedPayload,
  TransactionFailedPayload,
  TransactionStatusUpdatedPayload,
} from './dto/notification-payloads.dto';
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
    private authService: AuthService,
  ) {
    this.logger.setContext(NotificationsGateway.name);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const auth = socket.handshake.auth satisfies Partial<SocketAuthPayload>;
    this.logger.log(auth);

    if (!isValidClient(auth)) {
      socket.disconnect();
      return;
    }

    const { clientType } = auth;
    if (clientType === 'vendor') {
      const { token } = auth;
      const { sub, username, slug } = this.authService.verifyToken(token);
      this.presenceService.vendorConnected(
        { id: String(sub), username, slug },
        socket.id,
      );
    }

    this.logger.log(`Client connected: ${clientType} (${socket.id})`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const auth = socket.handshake.auth satisfies Partial<SocketAuthPayload>;
    this.logger.log(auth);

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

  @SubscribeMessage('vendor:join')
  async handleJoinVendor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinVendorPayload,
  ): Promise<void> {
    await client.join(`vendor-${payload.id}`);
    this.logger.log(`Client ${client.id} joined vendor-${payload.id}`);
  }

  @SubscribeMessage('presence:update')
  handlePresenceUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PresenceUpdate,
  ): void {
    this.presenceService.markAway(client.id);
    this.logger.log(
      `Client ${client.id} presence updated to ${payload.status}`,
    );
  }

  @SubscribeMessage('transaction:join')
  async handleJoinTransaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinTransactionPayload,
  ): Promise<void> {
    await client.join(`transaction-${payload.id}`);
    this.logger.log(`Client ${client.id} joined transaction-${payload.id}`);
  }

  @SubscribeMessage('milestone:transaction:printing')
  handleMilestoneTransactionPrinting(
    @MessageBody() payload: MilestoneTransactionPrinting,
  ): void {
    this.server
      .to(`transaction-${payload.vendorId}`)
      .emit('milestone:transaction:printing', payload);
    this.logger.log(
      `Milestone: Printing from vendor ${payload.vendorId} for transaction-${payload.transactionId}`,
    );
  }

  @SubscribeMessage('milestone:transaction:queued')
  handleMilestoneTransactionQueued(
    @MessageBody() payload: MilestoneTransactionQueued,
  ): void {
    this.server
      .to(`transaction-${payload.vendorId}`)
      .emit('milestone:transaction:queued', payload);
    this.logger.log(
      `Milestone: Queued from vendor ${payload.vendorId} for transaction-${payload.transactionId}`,
    );
  }

  emitNewTransactionToVendor(
    vendorId: number,
    payload: NewTransactionPayload,
  ): void {
    this.server.to(`vendor-${vendorId}`).emit('transaction:new', payload);
  }

  emitJobStatusUpdated(payload: JobStatusUpdatedPayload): void {
    this.server
      .to(`vendor-${payload.vendorId}`)
      .emit('job:status:updated', payload);

    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('job:status:updated', payload);

    this.logger.debug(
      `Emitted job:status:updated for job ${payload.jobId} in transaction ${payload.transactionId}`,
    );
  }

  emitJobCompleted(payload: JobCompletedPayload): void {
    this.server.to(`vendor-${payload.vendorId}`).emit('job:completed', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('job:completed', payload);

    this.logger.log(
      `Job ${payload.jobId} completed in transaction ${payload.transactionId}`,
    );
  }

  emitJobFailed(payload: JobFailedPayload): void {
    this.server.to(`vendor-${payload.vendorId}`).emit('job:failed', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('job:failed', payload);

    this.logger.warn(
      `Job ${payload.jobId} failed in transaction ${payload.transactionId}`,
    );
  }

  emitJobIncomplete(payload: JobIncompletePayload): void {
    this.server
      .to(`vendor-${payload.vendorId}`)
      .emit('job:incomplete', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('job:incomplete', payload);

    this.logger.warn(
      `Job ${payload.jobId} incomplete in transaction ${payload.transactionId} (${payload.pagesPrinted}/${payload.totalPages} pages)`,
    );
  }

  emitTransactionStatusUpdated(payload: TransactionStatusUpdatedPayload): void {
    this.server
      .to(`vendor-${payload.vendorId}`)
      .emit('transaction:status:updated', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('transaction:status:updated', payload);

    this.logger.debug(
      `Emitted transaction:status:updated for transaction ${payload.transactionId}`,
    );
  }

  emitTransactionCompleted(payload: TransactionCompletedPayload): void {
    this.server
      .to(`vendor-${payload.vendorId}`)
      .emit('transaction:completed', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('transaction:completed', payload);

    this.logger.log(`Transaction ${payload.transactionId} completed`);
  }

  emitTransactionFailed(payload: TransactionFailedPayload): void {
    this.server
      .to(`vendor-${payload.vendorId}`)
      .emit('transaction:failed', payload);
    this.server
      .to(`transaction-${payload.transactionId}`)
      .emit('transaction:failed', payload);

    this.logger.warn(`Transaction ${payload.transactionId} failed`);
  }
}
