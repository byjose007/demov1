import { Injectable, Logger } from '@nestjs/common';
import { TrafficLightGateway } from 'src/gateways/traffic-light-gateway';


@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  constructor(private trafficLightGateway: TrafficLightGateway) {}

  handleError(error: Error, context: string) {
    this.logger.error(`Error in ${context}: ${error.message}`, error.stack);
    
    const errorMessage = {
      context,
      message: error.message,
      timestamp: new Date().toISOString()
    };

    this.trafficLightGateway.broadcastError(errorMessage);
    
    return errorMessage;
  }

  handleSystemError(error: Error) {
    this.logger.error('Critical system error:', error);
    
    // Implementar lógica de recuperación del sistema
    return this.handleError(error, 'SYSTEM');
  }
}