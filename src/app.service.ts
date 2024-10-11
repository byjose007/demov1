import { HttpService } from '@nestjs/axios';
import { HttpCode, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { Gpio } from 'onoff';
import { Durations, Intersection } from './intersection.class';


@Injectable()
export class AppService implements OnModuleInit {
  isFlaseo = false
  isInit = false
  shouldContinueCycle: boolean = true
  intersection1: Intersection;
  intersection2: Intersection;
  intersection3: Intersection;
  intersection4: Intersection;
  peaton1: Intersection

  onModuleInit() {
    console.log('creando intersecciones...');
    this.intersection1 = new Intersection(17, 27, 22, { red: 1, yellow: 4, green: 10 });
    this.intersection2 = new Intersection(6, 13, 19, { red: 1, yellow: 4, green: 8 });
     this.intersection3 = new Intersection(12, 16, 20, { red: 1, yellow: 4, green: 8 });
    //  this.intersection4 = new Intersection(24, 25, 26, { red: 1000, yellow: 2000, green: 3000 });

    this.peaton1 = new Intersection(21, 0, 26, { red: 1, yellow: 0, green: 10 });
  }



  async startTrafficLightCycle(isInit = true) {
    this.isInit = isInit;
    this.shouldContinueCycle = true;
    this.isFlaseo = false;
    await this.stopTraffic(true, false)

    try {
      while (this.isInit) {

        if(this.isFlaseo) break;
        console.log('-------- Inicio del ciclo de luz --------1');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        // this.intersection4.turnRed();         
        // this.peaton1.turnRed();   
        await this.sleep(this.intersection1.getRedDuration);

        if(this.isFlaseo) break;
        console.log('-------- Fase1 ----- #2');
        console.log('Semáforo 1: Luz verde => 3');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnGreen();
        this.intersection2.turnRed();
        // this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnRed();
        await this.sleep(this.intersection1.getGreenDuration);

        if(this.isFlaseo) break;
        console.log('-------- Fase1 ----- #3');
        console.log('Semáforo 1: Luz Amarillo => 2');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnYellow();
        this.intersection2.turnRed();
         this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnRed();
        await this.sleep(this.intersection1.getYellowDuration);

        if(this.isFlaseo) break;
        console.log('-------- rojos ----- 4');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnRed();
        this.intersection2.turnRed();
         this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnRed();
        await this.sleep(this.intersection2.getRedDuration);

        if(this.isFlaseo) break;
        console.log('-------- Fase2------ #5');
        console.log('Semáforo 1: Luz Rojo => 1');
        console.log('Semáforo 2: Luz Verde => 6');
        console.log('peaton verde');
        this.intersection1.turnRed();
        this.intersection2.turnGreen();
         this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnGreen();
        await this.sleep(this.intersection2.getGreenDuration);

        if(this.isFlaseo) break;
        console.log('-------- Fase2 ----- #6');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz Amarillo => 5');
        this.intersection1.turnRed();
        this.intersection2.turnYellow();
        this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnGreen();
        await this.sleep(this.intersection2.getYellowDuration);



        if(this.isFlaseo) break;
        console.log('-------- rojos ----- #7');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnRed();
        // this.intersection4.turnRed();  
        // this.peaton1.turnRed();
        await this.sleep(this.intersection2.getRedDuration);


        if(this.isFlaseo) break;
        console.log('-------- Fase3 ------ #8');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnGreen();
        // this.intersection4.turnRed();  
        // this.peaton1.turnGreen();
        await this.sleep(this.intersection3.getGreenDuration);

        if(this.isFlaseo) break;
        console.log('-------- Fase3 ------ #9');
        console.log('Semáforo 1: Luz roja => 1');
        console.log('Semáforo 2: Luz roja => 4');
        this.intersection1.turnRed();
        this.intersection2.turnRed();
        this.intersection3.turnYellow();
        // this.intersection4.turnRed();  
        // this.peaton1.turnRed();
        await this.sleep(this.intersection3.getYellowDuration);


      }

      if (!this.isFlaseo) {
        await this.stopTraffic(false, false);
      }    
      console.log('salirrrrr semáforo*******');

    }
    catch (error) {
      await this.stopTraffic(false, false);
      console.log('salirrrrr con error semáforo*******');
    }
  }


  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Método para detener el ciclo infinito en una intersección específica
  async stopTraffic(init = false, flash = false): Promise<any> {
    this.isInit = init;
    this.isFlaseo = flash;
    this.shouldContinueCycle = init;
    try {
      console.log('detener semáforo', this.isFlaseo);
      return await Promise.all([
        await this.intersection1.stopTrafficLightCycle(),
        await this.intersection2.stopTrafficLightCycle(),
        await this.intersection3.stopTrafficLightCycle(),
        // await this.intersection4.stopTrafficLightCycle(),
        await this.peaton1.stopTrafficLightCycle()
      ]);
    } catch (e) {
      console.log(e, 'error');
    }
  }

  async stopCycle() {
    await this.stopTraffic()
    this.shouldContinueCycle = false;
  }

  async startPeaton() {
    console.log('iniciar peaton');

    this.intersection1.stopTrafficLightCycle()
    this.intersection2.stopTrafficLightCycle()
    
    this.intersection1.turnGreen(); // inteserection => rojo
    this.intersection2.turnRed();
    // this.intersection3.turnRed();
    // this.intersection4.turnRed();  
    this.peaton1.turnGreen() // peaton => verde
    await this.sleep(15000);
    // this.stopTraffic()
    await this.intersection1.stopTrafficLightCycle()
    await this.intersection2.stopTrafficLightCycle()
    await this.peaton1.stopTrafficLightCycle()
    await this.startTrafficLightCycle()
  }





  async flasheo(isFlaseo = true) {
    await this.stopTraffic(false, true)
    this.isFlaseo = isFlaseo;
    console.log('Iniciando flasheo', this.isFlaseo);
    if (!this.isFlaseo) {
      console.log('apagar flasheo', this.isFlaseo);
      // await this.stopCycle()
      await this.stopTraffic(false, isFlaseo)
      return;
    }

    while (this.isFlaseo) {
      try {
    
        await this.intersection1.turnYellow();
        await this.intersection2.turnRed();
        await this.intersection3.turnYellow();
        await this.sleep(1000);
        console.log('flashhhh');
        await this.intersection1.turnRed();
        await this.intersection2.turnYellow();
        await this.intersection3.turnRed();
        await this.sleep(1000);
      } catch (e) {
        console.log(e, 'error');
      }

    }

    await this.stopTraffic(false, false)
  }


    // inciar flasheo
    // @Cron('43 * * * *', { name: 'jobFlash' })
    // async handleCronFlash() {
    //   console.log('flasheo desde el cron');
    //   this.isInit = false;
    //   await this.flasheo(true);
    // }

  //  @Cron('37 * * * *')
  //  async handleCronInit() {
  //    console.log('iniciar desde el cron');
  //    this.isFlaseo = false;
  //    await this.flasheo(false);
  //    await this.initSemaphores(true);

  //  }


  //  @Cron('40 * * * *')
  //  async horarioMañana() {
  //    console.log('iniciar horarioMañana ----');
  //    this.isFlaseo = false;
  //    await this.flasheo(false);
  //    this.redLightDurationAll = 1;
  //    this.greenLightDuration = 10; 
  //    this.greenLightDurationF2 = 5; 
  //    this.yellowLightDuration = 2; 
  //    this.yellowLightDurationF2 = 2;
  //    this.redLightDuration = 1; 
  //    await this.initSemaphores(true);

  //  }


  //  @Cron('41 * * * *')
  //  async horarioTarde() {
  //    console.log('iniciar horarioTarde-----');
  //    this.isFlaseo = false;
  //    await this.flasheo(false);
  //    this.redLightDurationAll = 1;
  //    this.greenLightDuration = 4; 
  //    this.greenLightDurationF2 = 2; 
  //    this.yellowLightDuration = 2; 
  //    this.yellowLightDurationF2 = 2; 
  //    this.redLightDuration = 1; 
  //    await this.initSemaphores(true);

  //  }


  //  @Cron('42  * * * *')
  //  async horarioNoche() {
  //    console.log('iniciar horarioNoche---');
  //    this.isFlaseo = false;
  //    await this.flasheo(false);
  //    this.redLightDurationAll = 1;
  //    this.greenLightDuration = 6;
  //    this.greenLightDurationF2 = 3; 
  //    this.yellowLightDuration = 2; 
  //    this.yellowLightDurationF2 = 2; 
  //    this.redLightDuration = 1; // Duración de la luz roja en segundos
  //    await this.initSemaphores(true);

  //  }







}
