import * as chai from 'chai';
const assert = chai.assert;

import publicHello from '../../../../src/api/controllers/publicHello';

suite('publicHello', () => {

  test('publicHello(): No.1', (done) => {
    const req = {
      query: {message: 'World!'},
    };

    const res = {
      send: (body: string) => {
        assert.equal(body, 'Hello World!');
        done();
      }
    };

    publicHello(<any>req, <any>res);
  });

});
