export interface GenericRepository<T> {
  nextId(): string;
  findOneById(id: string): Promise<T | null>;
  save(data: T): Promise<void>;
}
