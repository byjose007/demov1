import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Gpio } from 'onoff';
import { TrafficLightService } from './traffic-light.service';
import { Intersection } from './intersection.class';
import { ButtonService } from './button.service';

@Controller()
export class AppController {


  constructor(private readonly appService: AppService, private buttonService: ButtonService) {
 
  }




  @Get('/start')
  async  startTrafficLightCycle() {
    // await this.appService.createIntersections()
    await this.appService.startTrafficLightCycle()    
    return { message: 'Traffic light cycle completed.' };
   }

 

 
   @Get('/stop')
     parar() {
    this.appService.stopTraffic()
     return { message: 'Stop Traffic start cycle completed.' };
   }
 
   @Get('/flash')
   async flasheo() {
    //  console.log('flasheo*****');     
      await this.appService.flasheo();
      return { message: 'flashh' };
   }

   @Get('/startPeaton')
   async startPeaton() {
    // this.buttonService.onModuleInit()
    await this.appService.startPeaton()
  // Crea una instancia de Gpio para el pin de botón, con la opción 'in' para leer su valor

   }
}
