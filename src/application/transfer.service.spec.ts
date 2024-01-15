import { TransferService } from './transfer.service';

describe('TransfersService', () => {
  describe('extractTransferValues', () => {
    it('ERC-20 전송 토픽과 데이터인 경우, 파싱한다', () => {
      const given: [string[], string] = [
        [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000187369cd5b3a7fbf029d5e854b17f1bc40965f5',
          '0x0000000000000000000000006cea41305a83e2c69da076825ea1f8a9cb2b4fb8',
        ],
        '0x000000000000000000000000000000000000000000000000000000010e4e9bc0',
      ];
      const got = TransferService.extractTransferValues(given[0], given[1]);
      const want = [
        {
          from: '0x0187369cd5b3a7fbf029d5e854b17f1bc40965f5',
          to: '0x6cea41305a83e2c69da076825ea1f8a9cb2b4fb8',
          amount: 4535000000n,
          index: null,
        },
      ];

      expect(got).toEqual(want);
    });

    it('ERC-721 전송 토픽과 데이터인 경우, 파싱한다', () => {
      const given: [string[], string] = [
        [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000911bb65a13af3f83cd0b60bf113b644b53d7e438',
          '0x000000000000000000000000488a14b1490313e966229dea4f106f6c60f74c66',
          '0x00000000000000000000000000000000000000000000000000000000000017da',
        ],
        '0x',
      ];
      const got = TransferService.extractTransferValues(given[0], given[1]);
      const want = [
        {
          from: '0x911bb65a13af3f83cd0b60bf113b644b53d7e438',
          to: '0x488a14b1490313e966229dea4f106f6c60f74c66',
          amount: 1n,
          index: 6106n,
        },
      ];

      expect(got).toEqual(want);
    });

    it('ERC-1155 단건 전송 토픽과 데이터인 경우, 파싱한다', () => {
      const given: [string[], string] = [
        [
          '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
          '0x000000000000000000000000a604060890923ff400e8c6f5290461a83aedacec',
          '0x000000000000000000000000d7b2944d5c8223f7b1b5c59481ba00d912031212',
          '0x00000000000000000000000024c585a904f72e972e10dab907df6ee3b6ea37c9',
        ],
        '0x' +
          'd7b2944d5c8223f7b1b5c59481ba00d912031212000000000000090000000001' +
          '0000000000000000000000000000000000000000000000000000000000000001',
      ];
      const got = TransferService.extractTransferValues(given[0], given[1]);
      const want = [
        {
          from: '0xd7b2944d5c8223f7b1b5c59481ba00d912031212',
          to: '0x24c585a904f72e972e10dab907df6ee3b6ea37c9',
          amount: 1n,
          index: 97562784767050311814223641658030207622243581577312294056075295194783141593089n,
        },
      ];

      expect(got).toEqual(want);
    });

    it('ERC-1155 여러건 전송 토픽과 데이터인 경우, 파싱한다', () => {
      const given: [string[], string] = [
        [
          '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
          '0x000000000000000000000000b4e62d6363f82e0e74e8963828815f907eab2c66',
          '0x000000000000000000000000b4e62d6363f82e0e74e8963828815f907eab2c66',
          '0x000000000000000000000000059a06f9ee4b7d352c0a11e8f0e0995a65f41388',
        ],
        '0x' +
          '0000000000000000000000000000000000000000000000000000000000000040' +
          '00000000000000000000000000000000000000000000000000000000000000a0' +
          '0000000000000000000000000000000000000000000000000000000000000002' +
          'e86073b90666547b822887cfd7d4e6e973906e5c000000000021240000000001' +
          'e86073b90666547b822887cfd7d4e6e973906e5c00000000000ff80000000001' +
          '0000000000000000000000000000000000000000000000000000000000000002' +
          '0000000000000000000000000000000000000000000000000000000000000001' +
          '0000000000000000000000000000000000000000000000000000000000000001',
      ];
      const got = TransferService.extractTransferValues(given[0], given[1]);
      const want = [
        {
          from: '0xb4e62d6363f82e0e74e8963828815f907eab2c66',
          to: '0x059a06f9ee4b7d352c0a11e8f0e0995a65f41388',
          amount: 1n,
          index: 105106996878630511210248856593636848502986555109151911559735836982925433241601n,
        },
        {
          from: '0xb4e62d6363f82e0e74e8963828815f907eab2c66',
          to: '0x059a06f9ee4b7d352c0a11e8f0e0995a65f41388',
          amount: 1n,
          index: 105106996878630511210248856593636848502986555109151911559735832149472317538305n,
        },
      ];

      expect(got).toEqual(want);
    });

    it('전송이 아닌 토픽과 로그인 경우, 빈 배열을 반환한다', () => {
      const given: [string[], string] = [
        [
          '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118',
          '0x0000000000000000000000008c38816f9f39c241a5ad964c892f979bf3fc7372',
          '0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0x0000000000000000000000000000000000000000000000000000000000000064',
        ],
        '0x' +
          '0000000000000000000000000000000000000000000000000000000000000001' +
          '000000000000000000000000756befae6d2731045f7fd84c10bf3ded60ff5353',
      ];
      const got = TransferService.extractTransferValues(given[0], given[1]);
      const want: never[] = [];

      expect(got).toEqual(want);
    });
  });

  describe('indexTransfers', () => {
    it('전송된 토큰을 모르면, tokenId를 null로 저장한다', () => {});

    it('전송된 토큰을 알면, tokenId를 찾은 토큰의 id로 저장한다', () => {});

    it('전송된 인스턴스를 모르면, instanceId를 null로 저장한다', () => {});

    it('전송된 인스턴스를 알면, instanceId를 찾은 인스턴스의 id로 저장한다', () => {});
  });
});
