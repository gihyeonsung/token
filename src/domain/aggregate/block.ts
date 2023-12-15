import { Base } from './base';

// TODO
// 블럭, 트랜잭션, 전송은 생명 주기가 일치한다. 일관적으로 수정할 필요는 없으나 이것을 aggregate로 묶는건 타당할까?
export class Block extends Base {
  number: number;
  hash: string;
  timestamp: number;
}
