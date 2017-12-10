//--------------------------------------------------
//  Chai
//--------------------------------------------------

declare const expect: Chai.ExpectStatic;
declare const should: Chai.Should;
declare const assert: Chai.Assert;

//--------------------------------------------------
//  secure-random
//--------------------------------------------------

declare module 'secure-random' {
  function secureRandom(byteCount: number, options?: {type: string}): any;
  export = secureRandom;
}
