import { Logger } from '../application';

export class ConsoleLogger implements Logger {
  debug(message: string, ...data: any[]): void {
    console.log(new Date(), 'debug', message, ...data);
  }

  info(message: string, ...data: any[]): void {
    console.log(new Date(), 'info', message, ...data);
  }

  error(message: string, ...data: any[]): void {
    console.log(new Date(), 'error', message, ...data);
  }
}
