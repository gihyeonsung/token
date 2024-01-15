import { decodeEvent } from './utils';

describe('decodeEvent', () => {
  it('결과에 주소값이 있을때, 값을 디코딩하면 소문자로 바뀐 주소를 받는다', () => {
    const got = decodeEvent(
      'event Transfer(address indexed, address indexed, uint256)',
      [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000ce05248ed344ec913ebce66ae562db912fdbc37a',
        '0x0000000000000000000000001d75de8dc2895ac4be00d3bab9f92882fc88bef2',
      ],
      '0x0000000000000000000000000000000000000000000000000000000069c8e9df',
    );

    const want = [
      '0xce05248ed344ec913ebce66ae562db912fdbc37a',
      '0x1d75de8dc2895ac4be00d3bab9f92882fc88bef2',
      BigInt('0x69c8e9df'),
    ];

    expect(got).toStrictEqual(want);
  });
});
