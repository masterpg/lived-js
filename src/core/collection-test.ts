import * as core from '.';

suite('collection.List', () => {

  interface Person {
    id: number,
    email: string,
    first: string,
    last: string,
  }

  const persons: Person[] = [
    {id: 2, email: 'rukawa@xxx.yyy.zzz', first: '楓', last: '流川'},
    {id: 5, email: 'kogure@xxx.yyy.zzz', first: '公延', last: '木暮'},
    {id: 4, email: 'haruko@xxx.yyy.zzz', first: '晴子', last: '赤木'},
    {id: 3, email: 'gori@xxx.yyy.zzz', first: '剛憲', last: '赤木'},
    {id: 1, email: 'sakuragi@xxx.yyy.zzz', first: '花道', last: '桜木'},
  ];

  setup(() => {
  });

  teardown(() => {
  });

  test('デフォルトの使用ケース1', () => {
    const list = new core.collection.List(persons);
    const actual = <Person>list.getItemByKey(4);
    assert.equal(actual.id, 4);
    assert.equal(actual.email, 'haruko@xxx.yyy.zzz');
  });

  test('デフォルトの使用ケース2', () => {
    const list = new core.collection.List<Person>();
    list.push(persons[0]);
    list.push(persons[1]);
    list.push(persons[2]);
    list.push(persons[3]);
    list.push(persons[4]);
    const actual = <Person>list.getItemByKey(4);
    assert.equal(actual.id, 4);
    assert.equal(actual.email, 'haruko@xxx.yyy.zzz');
  });

  test('keyFieldを使用した場合', () => {
    const list = new core.collection.List(persons, 'email');
    const actual = <Person>list.getItemByKey('haruko@xxx.yyy.zzz');
    assert.equal(actual.id, 4);
    assert.equal(actual.email, 'haruko@xxx.yyy.zzz');
  });

  test('getItemByKey(): binarySearchを指定した場合(昇順)', () => {
    const list = new core.collection.List(persons);
    // バイナリサーチ前にリストをソート(昇順)
    list.sortItems();
    // バイナリサーチを指定してアイテム取得
    const actual = <Person>list.getItemByKey(4, true);
    assert.equal(actual.id, 4);
    assert.equal(actual.email, 'haruko@xxx.yyy.zzz');
  });

  test('removeItem(): indexを指定した場合', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    const removedItem = <Person>list.removeItem(1);
    assert.equal(list.length, persons.length - 1);
    assert.equal(removedItem.id, targetItem.id);
    assert.isNotOk(list.getItemByKey(removedItem));
  });

  test('removeItem(): アイテムを指定した場合', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    const removedItem = <Person>list.removeItem(targetItem);
    assert.equal(list.length, persons.length - 1);
    assert.equal(removedItem.id, targetItem.id);
    assert.isNotOk(list.getItemByKey(removedItem));
  });

  test('removeItemByKey()', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    const removedItem = <Person>list.removeItemByKey(targetItem.id);
    assert.equal(list.length, persons.length - 1);
    assert.equal(removedItem.id, targetItem.id);
    assert.isNotOk(list.getItemByKey(removedItem));
  });

  test('removeItemByKey(): binarySearchを指定した場合', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    // バイナリサーチ前にリストをソート
    list.sortItems();
    // バイナリサーチを指定してアイテム削除
    const removedItem = <Person>list.removeItemByKey(targetItem.id, true);
    assert.equal(list.length, persons.length - 1);
    assert.equal(removedItem.id, targetItem.id);
    assert.isNotOk(list.getItemByKey(removedItem));
  });

  test('insertItem()', () => {
    const newItem = {id: 6, email: 'taro@xxx.yyy.zzz', first: '太郎', last: '山田'};
    const list = new core.collection.List(persons);
    list.insertItem(1, newItem);
    assert.equal(list.length, persons.length + 1);
    assert.equal(list.indexOf(newItem), 1);
  });

  test('contains()', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    assert.isTrue(list.contains(targetItem));
  });

  test('containsByKey()', () => {
    const list = new core.collection.List(persons);
    const targetItem = persons[1];
    assert.isTrue(list.containsByKey(targetItem.id));
  });

  test('containsByKey(): binarySearchを指定した場合', () => {
    const list = new core.collection.List(persons);
    // バイナリサーチ前にリストをソート
    list.sortItems(true);
    // バイナリサーチを指定してアイテム有無をチェック
    const targetItem = persons[1];
    assert.isTrue(list.containsByKey(targetItem.id, true));
  });

  test('clear()', () => {
    const list = new core.collection.List(['a', 'b', 'c']);
    list.clear();
    assert.equal(list.length, 0);
  });

  test('addAll()', () => {
    const list = new core.collection.List(['a', 'b']);
    list.addAll(['c', 'd']);
    const array = ([] as string[]).concat(list);
    assert.deepEqual(array, ['a', 'b', 'c', 'd']);
  });

  test('sortItems(): 昇順', () => {
    const list = new core.collection.List<{ id: number }>();
    for (let i = 0; i < 100; i++) {
      list.push({
        id: core.utils.randomInt(1, 100)
      });
    }

    list.sortItems();

    let prev: {id: number} = list[0];
    for (let i = 0; i < 100; i++) {
      let current = list[i];
      expect(current.id).to.be.at.least(prev.id);
      prev = current;
    }
  });

});
