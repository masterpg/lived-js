import * as core from '.';

suite('utils', () => {

  setup(() => {
  });

  teardown(() => {
  });

  test('randomInt(): No.1', function () {
    for (let i = 0; i < 100; i++) {
      const actual = core.utils.randomInt(-10, 10);
      assert.isAtLeast(actual, -11);
      assert.isAtMost(actual, 11);
    }
  });

});
