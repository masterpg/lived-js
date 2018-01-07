//--------------------------------------------------
//  secure-random
//--------------------------------------------------

declare module 'secure-random' {
  function secureRandom(byteCount: number, options?: {type: string}): any;
  export = secureRandom;
}
