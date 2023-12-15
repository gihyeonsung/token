export class OutboxMessage {
  constructor(
    readonly id: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly deletedAt: Date,
    private published: boolean,
    private publishedAt: Date | null,
    private readonly message: string,
  ) {}
}
