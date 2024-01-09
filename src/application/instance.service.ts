import { Block, Instance, Token, TokenIndexedEvent, TransferIndexedEvent } from '../domain';
import { BlockRepository } from './block.repository';
import { InstanceRepository } from './instance.repository';
import { NetworkConnector } from './network.connector';

export class InstanceService {
  constructor(
    private readonly instanceRepository: InstanceRepository,
    private readonly networkConnector: NetworkConnector,
    private readonly blockRepository: BlockRepository,
  ) {}

  static readonly IPFS_GATEWAY_BASE_URL = 'https://ipfs.io/ipfs/';

  async handleTransferIndexedEvent(event: TransferIndexedEvent): Promise<void> {
    const { chainId, transfer, token } = event;
    const instanceId = transfer.instanceId;
    if (token === null || token.type === 'ERC-20' || instanceId === null) {
      return;
    }

    const instance = await this.instanceRepository.findOneById(instanceId);
    if (instance === null) {
      throw new Error('instance id exist, but cannot find one');
    }

    if (!instance.shouldUriAndMetadataUpdated()) {
      return;
    }

    const instanceUriAndMetadataUpdatedAtBlock = await this.blockRepository.findOneLatest(chainId);
    if (instanceUriAndMetadataUpdatedAtBlock === null) {
      throw new Error('transfered but no block found');
    }

    const uri = await this.fetchUri(chainId, instanceUriAndMetadataUpdatedAtBlock, token, instance);
    if (uri === null) {
      // tokenURI()는 721 스펙상 OPTIOANL 하다
      return;
    }

    const metadata = await this.fetchMetadata(uri);
    if (metadata === null) {
      return;
    }

    instance.updateUriAndMetadata(uri, metadata, instanceUriAndMetadataUpdatedAtBlock.id);

    await this.instanceRepository.save(instance);
  }

  async handleTokenIndexedEvent(event: TokenIndexedEvent): Promise<void> {
    if (event.token.type === 'ERC-20') {
      return;
    }

    // TODO: ERC-721 enumerable을 사용해, 새로 추가된 토큰들의 인스턴스 backfill을 시도한다
    if (event.token.type === 'ERC-721') {
    }

    // TODO: Transfer.instanceId, Instance.tokenId 빈곳 찾아서 업데이트 해줘야 함
  }

  async fetchUri(chainId: string, block: Block, token: Token, index: Instance): Promise<string | null> {
    const [uri] = await this.networkConnector.call<[string]>({
      chainId: chainId,
      blockHash: block.hash,
      address: token.address,
      functionSignature: 'function tokenURI(uint256) view returns (string)',
      inputs: [index.index],
    });
    return uri;
  }

  async fetchMetadata(uri: string): Promise<unknown | null> {
    if (uri.startsWith('ipfs://')) {
      uri.replace('ipfs://', InstanceService.IPFS_GATEWAY_BASE_URL);
    }

    const response = await fetch(uri);
    if (!response.ok) {
      return null;
    }

    if (response.headers.get('content-type') !== 'application/json') {
      return null;
    }

    return await response.json();
  }
}
