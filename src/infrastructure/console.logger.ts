import { Logger } from '../application';

export class ConsoleLogger implements Logger {
  log(message: string, ...data: any[]): void {
    console.log(new Date(), message, ...data);
  }
}
