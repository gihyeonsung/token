import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Instance extends Base {
  readonly index: bigint;
  readonly tokenId: string;
  private ownerAddress: string;
  private uri: string | null;
  private uriUpdatedAtBlockId: string;
  private metadata: unknown | null;
  private metadataUpdatedAtBlockId: string;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    index: bigint,
    tokenId: string,
    ownerAddress: string,
    uri: string | null,
    uriUpdatedAtBlockId: string,
    metadata: unknown | null,
    metadataUpdatedAtBlockId: string,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(ownerAddress)) throw new Error('owner address must be lower address');

    this.index = index;
    this.tokenId = tokenId;
    this.ownerAddress = ownerAddress;
    this.uri = uri;
    this.uriUpdatedAtBlockId = uriUpdatedAtBlockId;
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = metadataUpdatedAtBlockId;
  }

  shouldUriAndMetadataUpdated() {
    if (this.uri === null) {
      return true;
    }
    if (this.metadata === null) {
      return true;
    }
    return false;
  }

  updateUriAndMetadata(uri: string, metadata: unknown, uriAndMetadataUpdatedAtBlockId: string) {
    this.updatedAt = new Date();
    this.uri = uri;
    this.uriUpdatedAtBlockId = uriAndMetadataUpdatedAtBlockId;
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = uriAndMetadataUpdatedAtBlockId;

    // TODO: '수정하려고 하는 값이 기존 저장된 값보다 최근 값인 경우에만 업데이트한다'라는 제약 조건은 어디서 검사할수 있을까?
    // 1. app layer에서 받아오기
    // 2. app layer에서 검증하기
  }

  updateMetadata(metadata: unknown, metadataUpdatedAtBlockId: string) {
    this.updatedAt = new Date();
    this.metadata = metadata;
    this.metadataUpdatedAtBlockId = metadataUpdatedAtBlockId;
  }
}
