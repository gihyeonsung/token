export type Token = {
  chainId: number;
  address: string;
  name?: string;
  symbol?: string;
  decimal?: number;
  holderCount: number;
  totalSupply?: string;
  iconUrl?: string;
  transferCount?: number; // ?? 가능하긴 한가
};

export type ResponseGetTokens = {
  status: number;
  data: {
    items: Token[];
    cursor?: string;
  };
};

export class TokenController {
  async getTokens(): Promise<unknown> {
    return;
  }

  async getInstances(): Promise<unknown> {
    return;
  }
}

/**
 * GET /chain/:chain-id/tokens
 * POST /chain/:chain-id/tokens/import
 * GET /chain/:chain-id/tokens/:address
 * GET /chain/:chain-id/tokens/:address/transfers
 * GET /chain/:chain-id/tokens/:address/instances
 * GET /chain/:chain-id/tokens/:address/instances/:instance-id
 * POST /chain/:chain-id/tokens/:address/instances/:instance-id/refresh
 * GET /chain/:chain-id/tokens/:address/instances/:instance-id/transfers
 * GET /chain/:chain-id/addresses/:address/balances
 * GET /chain/:chain-id/addresses/:address/transfers
 */
