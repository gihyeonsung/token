import { isLowerAddress } from '../utils';
import { Base } from './base';

export class Instance extends Base {
  readonly index: bigint;
  readonly tokenId: string;
  private ownerAddress: string;
  private uri: string | null;
  private uriUpdatedAt: Date | null;
  private metadata: string | null;
  private metadataUpdatedAt: Date | null;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    index: bigint,
    tokenId: string,
    ownerAddress: string,
    uri: string | null,
    uriUpdatedAt: Date | null,
    metadata: string | null,
    metadataUpdatedAt: Date | null,
  ) {
    super(id, createdAt, updatedAt);

    if (!isLowerAddress(ownerAddress)) throw new Error('owner address must be lower address');

    this.index = index;
    this.tokenId = tokenId;
    this.ownerAddress = ownerAddress;
    this.uri = uri;
    this.uriUpdatedAt = uriUpdatedAt;
    this.metadata = metadata;
    this.metadataUpdatedAt = metadataUpdatedAt;
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

  updateUriAndMetadata(uri: string, metadata: string, uriAndMetadataUpdatedAt: Date) {
    this.updatedAt = new Date();
    this.uri = uri;
    this.uriUpdatedAt = uriAndMetadataUpdatedAt;
    this.metadata = metadata;
    this.metadataUpdatedAt = uriAndMetadataUpdatedAt;

    // TODO: '수정하려고 하는 값이 기존 저장된 값보다 최근 값인 경우에만 업데이트한다'라는 제약 조건은 어디서 검사할수 있을까?
    // 1. app layer에서 받아오기
    // 2. app layer에서 검증하기
  }

  updateMetadata(metadata: string, metadataUpdatedAt: Date) {
    this.updatedAt = new Date();
    this.metadata = metadata;
    this.metadataUpdatedAt = metadataUpdatedAt;
  }
}
