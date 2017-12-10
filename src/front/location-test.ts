import * as front from '.';

suite('location', () => {

  setup(() => {
  });

  teardown(() => {
  });

  test('parse()', () => {
    const actual = front.location.parse('/foo/bar/index.html?name=taro&age=21#toc');
    assert.equal(actual.path, '/foo/bar/index.html');
    assert.equal(actual.hash, 'toc');
    assert.equal(actual.dir, '/foo/bar');
    assert.equal(actual.base, 'index.html');
    assert.equal(actual.ext, '.html');
    assert.deepEqual(actual.query, {name: 'taro', age: '21'});
  });

  test('parse(): 日本語', () => {
    const actual = front.location.parse('/ホゲ/フガ/インデックス.html?name=太郎&age=21#目次');
    assert.equal(actual.path, '/ホゲ/フガ/インデックス.html');
    assert.equal(actual.hash, '目次');
    assert.equal(actual.dir, '/ホゲ/フガ');
    assert.equal(actual.base, 'インデックス.html');
    assert.equal(actual.ext, '.html');
    assert.deepEqual(actual.query, {name: '太郎', age: '21'});
  });

  test('parse(): 日本語(エスケープ)', () => {
    const actual = front.location.parse('/%E3%83%9B%E3%82%B2/%E3%83%95%E3%82%AC/%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9.html?name=%E5%A4%AA%E9%83%8E&age=21#%E7%9B%AE%E6%AC%A1');
    assert.equal(actual.path, '/ホゲ/フガ/インデックス.html');
    assert.equal(actual.hash, '目次');
    assert.equal(actual.dir, '/ホゲ/フガ');
    assert.equal(actual.base, 'インデックス.html');
    assert.equal(actual.ext, '.html');
    assert.deepEqual(actual.query, {name: '太郎', age: '21'});
  });

  test('parse(): クエリにスペースを含んだ場合', () => {
    const actual = front.location.parse('/index.html?a=b c');
    assert.deepEqual(actual.query, {a: 'b c'});
  });

  test('parse(): クエリにスペース(エスケープ)を含んだ場合', () => {
    const actual = front.location.parse('/index.html?a=b%20c');
    assert.deepEqual(actual.query, {a: 'b c'});
  });

  test('parse(): クエリに"+"を含んだ場合', () => {
    const actual = front.location.parse('/index.html?a=b+c');
    assert.deepEqual(actual.query, {a: 'b c'});
  });

  test('getBase()', () => {
    const actual1 = front.location.getBase('/foo/bar/index.html');
    assert.equal(actual1, 'index.html');

    const actual2 = front.location.getBase('/foo/bar');
    assert.equal(actual2, 'bar');

    const actual3 = front.location.getBase('../../css/style.css');
    assert.equal(actual3, 'style.css');
  });

  test('getExt()', () => {
    const actual1 = front.location.getExt('/foo/bar/index.html');
    assert.equal(actual1, '.html');

    const actual2 = front.location.getExt('style.min.css');
    assert.equal(actual2, '.css');

    const actual3 = front.location.getExt('index.');
    assert.equal(actual3, '');

    const actual4 = front.location.getExt('README');
    assert.equal(actual4, '');

    const actual5 = front.location.getExt('.gitignore');
    assert.equal(actual5, '');
  });

  test('getDir()', () => {
    const actual1 = front.location.getDir('./');
    assert.equal(actual1, '/test/front');

    const actual2 = front.location.getDir('foo/bar/index.html');
    assert.equal(actual2, '/test/front/foo/bar');

    const actual3 = front.location.getDir('foo/bar/index.html');
    assert.equal(actual3, '/test/front/foo/bar');

    const actual4 = front.location.getDir('/foo/bar/index.min.html');
    assert.equal(actual4, '/foo/bar');

    const actual5 = front.location.getDir('/foo/bar');
    assert.equal(actual5, '/foo');

    const actual6 = front.location.getDir('../../css/style.css');
    assert.equal(actual6, '/css');

    const actual7 = front.location.getDir('./js/main.min.js');
    assert.equal(actual7, '/test/front/js');

    const actual8 = front.location.getDir('http://localhost:5000/test/front/foo/bar/index.html');
    assert.equal(actual8, '/test/front/foo/bar');
  });

  // test('toPath()', () => {
  //   const actual1 = front.location.toPath(('foo/bar/index.html'));
  //   assert.equal(actual1, '/test/foo/bar/index.html');
  //
  //   const actual2 = front.location.toPath(('/foo/bar/index.html'));
  //   assert.equal(actual2, '/foo/bar/index.html');
  //
  //   const actual3 = front.location.toPath(('http://localhost:5000/foo/bar/index.html'));
  //   assert.equal(actual3, '/foo/bar/index.html');
  // });
  //
  // test('join()', () => {
  //   const actual1 = front.location.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
  //   assert.equal(actual1, '/foo/bar/baz/asdf');
  //
  //   // "/test/../css/style.css"がノーマライズされ"/css/style.css"になる
  //   const actual2 = front.location.join('../css/style.css');
  //   assert.equal(actual2, '/css/style.css');
  //
  //   const actual3 = front.location.join('http://example.com', 'bar/foo', '../css/style.css');
  //   assert.equal(actual3, 'http://example.com/bar/css/style.css');
  // });

  test('split()', () => {
    const actual1 = front.location.split('/foo/bar/index.html');
    assert.deepEqual(['foo', 'bar', 'index.html'], actual1);

    const actual2 = front.location.split('foo/bar/index.html');
    assert.deepEqual(['foo', 'bar', 'index.html'], actual2);

    const actual3 = front.location.split('/foo/bar');
    assert.deepEqual(['foo', 'bar'], actual3);

    const actual4 = front.location.split('../../css/style.css');
    assert.deepEqual(['..', '..', 'css', 'style.css'], actual4);

    const actual5 = front.location.split('./js/main.min.js');
    assert.deepEqual(['js', 'main.min.js'], actual5);
  });

});