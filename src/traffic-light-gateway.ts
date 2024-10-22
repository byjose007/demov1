import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { Injectable } from '@nestjs/common';
import { Intersection } from './intersection.class';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
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
    this.statusInterval = setInterval(() => {
      const status = this.appService.getIntersectionsStatus();
      this.broadcastStatus(status);
    }, 1000); // Actualiza cada segundo
  }

  private stopStatusInterval() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  private broadcastStatus(status: any[]) {
    this.server.emit('trafficStatus', status);
  }
}