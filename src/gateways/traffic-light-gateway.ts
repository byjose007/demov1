import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { TrafficState } from 'src/interfaces/trafic-state.interface';


@WebSocketGateway(3201, {
  cors: {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST'],
    credentials: true
  },
})
@Injectable()
export class TrafficLightGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrafficLightGateway.name);
  private clients: Set<Socket> = new Set();

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.clients.add(client);
    
    client.emit('connection', { message: 'Successfully connected to traffic light system' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.clients.delete(client);
  }

  broadcastStatus(status: TrafficState) {
    if (this.server) {
      this.server.emit('trafficStatus', status);
    }
  }

  sendToClient(clientId: string, event: string, data: any) {
    const client = Array.from(this.clients).find(c => c.id === clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcastError(error: any) {
    this.server.emit('error', {
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}