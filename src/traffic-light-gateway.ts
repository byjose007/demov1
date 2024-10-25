import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { Injectable } from '@nestjs/common';
import { Intersection } from './intersection.class';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  },
})
@Injectable()
export class TrafficLightGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Set<Socket> = new Set();
  private statusInterval: NodeJS.Timeout;

  constructor(private readonly appService: AppService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);

    // Enviar estado inicial inmediatamente
    const initialStatus = this.appService.getIntersectionsStatus();
    client.emit('trafficStatus', initialStatus);

    // Si es el primer cliente, iniciamos el intervalo
    if (this.clients.size === 1) {
      this.startStatusInterval();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);

    // Si no hay más clientes, detenemos el intervalo
    if (this.clients.size === 0) {
      this.stopStatusInterval();
    }
  }

  private startStatusInterval() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    
    this.statusInterval = setInterval(() => {
      const status: any= this.appService.getIntersectionsStatus();
      this.broadcastStatus(status);
    }, 1000);
  }

  private stopStatusInterval() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  private broadcastStatus(status: Intersection[]) {
    this.server.emit('trafficStatus', status);
  }
}