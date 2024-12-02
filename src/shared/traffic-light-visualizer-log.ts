export class TrafficLightVisualizer {
  private static colors = {
      red: '\x1b[31m●\x1b[0m',    // Círculo rojo
      yellow: '\x1b[33m●\x1b[0m',  // Círculo amarillo
      green: '\x1b[32m●\x1b[0m',   // Círculo verde
      off: '○'                      // Círculo apagado
  };

  static drawTrafficLight(lightNumber: number, activeColor: 'red' | 'yellow' | 'green' | 'off', phase: string) {
      const red = activeColor === 'red' ? this.colors.red : this.colors.off;
      const yellow = activeColor === 'yellow' ? this.colors.yellow : this.colors.off;
      const green = activeColor === 'green' ? this.colors.green : this.colors.off;

      console.log(`\n-------- caso ${phase} --------`);
      console.log(`Semáforo ${lightNumber}:`);
      console.log(`  ${red}  `);
      console.log(`  ${yellow}  `);
      console.log(`  ${green}  `);
      console.log(`\n--------  --------`);
      
  }
}