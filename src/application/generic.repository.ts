export interface GenericRepository<T> {
  nextId(): string;
  findOneById(id: string): Promise<T>;
  save(data: T): Promise<void>;
}
