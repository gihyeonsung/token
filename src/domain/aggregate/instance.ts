import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Instance extends Base {
  private readonly instanceId: bigint;
  private ownerAddress: string;
  private uri: string | null;
  private uriUpdatedAtBlockId: string;
  private metadata: unknown | null;
  private metadataUpdatedAtBlockId: string;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    instanceId: bigint,
    ownerAddress: string,
    uri: string | null,
    uriUpdatedAtBlockId: string,
    metadata: unknown | null,
    metadataUpdatedAtBlockId: string,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(ownerAddress)) throw new Error('owner address must be lower address');

    this.instanceId = instanceId;
    this.ownerAddress = ownerAddress;
    this.uri = uri;
    this.uriUpdatedAtBlockId = uriUpdatedAtBlockId;
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = metadataUpdatedAtBlockId;
  }

  updateUriAndMetadata(uri: string, uriUpdatedAtBlockId: string, metadata: unknown, metadataUpdateAtBlockId: string) {
    this.uri = uri;
    this.uriUpdatedAtBlockId = uriUpdatedAtBlockId;
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = metadataUpdateAtBlockId;

    // TODO: '수정하려고 하는 값이 기존 저장된 값보다 최근 값인 경우에만 업데이트한다'라는 제약 조건은 어디서 검사할수 있을까?
    // 1. app layer에서 받아오기
    // 2. app layer에서 검증하기
  }

  updateMetadata(metadata: unknown, metadataUpdatedAtBlockId: string) {
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = metadataUpdatedAtBlockId;
  }
}
