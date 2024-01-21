// TODO: transactional decorator 구현
export interface GenericRepository<T> {
  nextId(): string;
  findOneById(id: string): Promise<T | null>;
  save(data: T): Promise<void>;
}
