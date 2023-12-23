import { IndexBlockCommand } from '../domain';

import { MessagePublisher } from './message.publisher';
import { NetworkConnector } from './network.connector';

export class NetworkImporter {
  constructor(
    private readonly networkConnectors: NetworkConnector[],
    private readonly messagePublisher: MessagePublisher,
  ) {
    // import하는 메시지는 domain event? command?
    // 이 과정은 transactional outbox로 구현되어야 하겠다
    networkConnectors.forEach((conn) => {
      conn.onNewBlockNumber(async (event) => {
        const command = new IndexBlockCommand(event.chainId, event.blockNumber);
        messagePublisher.publish(command);
      });
    });
  }

  handleNetBlock() {}
}
