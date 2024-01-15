export interface Logger {
  debug(message: string, ...data: any[]): void;
  info(message: string, ...data: any[]): void;
  error(message: string, ...data: any[]): void;
}
