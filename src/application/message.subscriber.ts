export type Subscriber = (message: any) => Promise<void>;

export interface MessageSubscriber {
  subscribe(subscriber: Subscriber): void;
  listen(): Promise<void>;
}
