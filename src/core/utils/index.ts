import secureRandom = require('secure-random');
import parser from '../parser';

export namespace utils {

  /**
   * 指定された範囲の整数の乱数を生成します。
   * @param min 最小値を指定します。
   * @param max 最大値を指定します。
   */
  export function randomInt(min: number, max: number): number {
    if ('undefined' !== typeof window) {
      // このMAX値内の乱数を生成する
      // Number.MAX_SAFE_INTEGER = 9007199254740991
      // Math.pow(2, 53) - 1     = 9007199254740991

      // secureRandom()はバイト単位でしか乱数を生成できなので、
      const randomBytes: Uint8Array = secureRandom(7, {type: 'Uint8Array'});
      // 必要ない上位ビットを切り捨てる
      randomBytes[0] = randomBytes[0] % 32;

      // 生成されたバイト値の乱数を10進数に変換
      const randHex = parser.bytesToHex(randomBytes);
      const randInt = parseInt(randHex, 16);

      // 指定された最小値〜最大値の範囲に調整
      const maxWork = max - min + 1;
      const mod = randInt % maxWork;
      return min + mod;
    } else {
      return Math.floor(Math.random() * (max - min) + min);
    }
  }

  /**
   * 指定された範囲の小数の乱数を生成します。
   * @param min 最小値を指定します。
   * @param max 最大値を指定します。
   */
  export function randomFloat(min: number, max: number): number {
    return (Math.random() * ((max + 1) - min)) + min;
  }

}

export default utils;