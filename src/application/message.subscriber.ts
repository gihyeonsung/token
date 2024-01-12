export type Handler = (message: any) => Promise<void>;

export interface MessageSubscriber {
  // TODO: delection policy ALWAYS | ON_SUCCESS | NEVER
  on(topic: string, handler: Handler): void;
  listen(): Promise<void>;
}
