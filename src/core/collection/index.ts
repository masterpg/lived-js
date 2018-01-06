namespace collection {

  /**
   * Arrayの拡張クラスです。
   */
  export class List<T> extends Array<T> {

    //----------------------------------------------------------------------
    //
    //  Constructors
    //
    //----------------------------------------------------------------------

    /**
     * アイテムデータリストのインスタンスを生成します。
     * @param keyField_or_arrayLength
     *   キーフィールドまたは配列の長さを指定します。
     *
     *   リスト内のアイテムを特定するキーを指定したい場合はフィールド名を指定します。
     *   指定しなかった場合はデフォルトで"id"がキーフィールドになります。
     *
     *   配列の長さが決まっている場合は配列の長さを指定します。
     */
    constructor(keyField_or_arrayLength?: string | number);

    /**
     * アイテムデータリストのインスタンスを生成します。
     * @param items
     *   アイテムデータリストのもとになるアイテムリストを指定します。
     * @param keyField
     *   リスト内のアイテムを特定するキーとなるフィールドを指定します。
     *   指定しないかった場合はデフォルトで"id"がキーフィールドになります。
     */
    constructor(items: T[], keyField?: string);

    constructor(arg1?: number | string | T[], arg2?: string) {
      let keyField = 'id';

      // arg1がnumberはシステム的に呼び出されることがある
      // (splice()などが使用されると呼び出される)
      if (typeof arg1 === 'number') {
        super(arg1);
      }
      // arg1が配列の場合
      else if (Array.isArray(arg1)) {
        super(...arg1);
        keyField = arg2 ? arg2 : keyField;
      }
      // arg1がstringまたは空の場合
      else {
        super();
        keyField = arg1 ? arg1 : keyField;
      }

      this.keyField = keyField;
    }

    //----------------------------------------------------------------------
    //
    //  Variables
    //
    //----------------------------------------------------------------------

    _desc: boolean;

    //----------------------------------------------------------------------
    //
    //  Properties
    //
    //----------------------------------------------------------------------

    /**
     * リスト内のアイテムを特定するキーとなるフィールドです。
     */
    keyField: string;

    //----------------------------------------------------------------------
    //
    //  Methods
    //
    //----------------------------------------------------------------------

    /**
     * 指定されたキーでアイテムを取得します。
     * @param key キーを指定します。
     * @param binarySearch
     *   バイナリサーチを行う場合はtrueを指定します。
     *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
     */
    getItemByKey(key: any, binarySearch?: boolean): T | null {
      const index = this.getIndexByKey(key, binarySearch);
      return index >= 0 ? this[index] : null;
    }

    /**
     * 指定されたキーでアイテムデータのインデックスを取得します。
     * @param key キーを指定します。
     * @param binarySearch
     *   バイナリサーチを行う場合はtrueを指定します。
     *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
     */
    getIndexByKey(key: any, binarySearch?: boolean): number {
      if (binarySearch) {
        return this._searchIndex(key);
      } else {
        const keyField = this.keyField;
        for (let i = 0; i < this.length; i++) {
          if (this[i][keyField] === key) {
            return i;
          }
        }
        return -1;
      }
    }

    /**
     * アイテムをリストから削除します。
     * @param index_or_item 削除対象のインデックスまたはアイテムを指定します。
     * @returns 削除されたアイテムを返します。
     */
    removeItem(index_or_item: number | T): T | null {
      let index: number;
      if (isNaN(index_or_item as number)) {
        index = this.indexOf(index_or_item as T);
      } else {
        index = index_or_item as number;
      }
      if (index >= 0) {
        return this.splice(index, 1)[0];
      } else {
        return null;
      }
    }

    /**
     * 指定されたキーで特定されるアイテムをリストから削除します。
     * @param key アイテムを特定するキーを指定します。
     * @param binarySearch
     *   バイナリサーチを行う場合はtrueを指定します。
     *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
     * @returns 削除されたアイテムを返します。
     */
    removeItemByKey(key: any, binarySearch?: boolean): T | null {
      const index = this.getIndexByKey(key, binarySearch);
      return this.removeItem(index);
    }

    /**
     * 指定されたインデックスにアイテムを挿入します。
     * @param index 挿入位置のインデックスを指定します。
     * @param item 挿入するアイテムを指定します。
     */
    insertItem(index: number, item: T): void {
      this.splice(index, 0, item);
    }

    /**
     * 指定されたアイテムがリストに含まれているかを取得します。
     * @param item
     */
    contains(item: T): boolean {
      return this.indexOf(item) >= 0;
    }

    /**
     * 指定されたキーで特定されるアイテムがリストに含まれているかを取得します。
     * @param key キーを指定します。
     * @param binarySearch
     *   バイナリサーチを行う場合はtrueを指定します。
     *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
     */
    containsByKey(key: any, binarySearch?: boolean): boolean {
      const index = this.getIndexByKey(key, binarySearch);
      return index >= 0;
    }

    /**
     * リストをクリアします。
     */
    clear(): void {
      this.splice(0, this.length);
    }

    /**
     * 指定された配列を連結します。
     * @param items
     */
    addAll<U extends T>(items: U[]): void {
      for (const item of items) {
        this.push(item);
      }
    }

    /**
     * キーでアイテムをソートします。
     * @param desc
     */
    sortItems(desc?: boolean): void {
      this._desc = desc ? desc : false;
      this.sort((a: T, b: T) => {
        if (!this._desc) {
          if (a[this.keyField] < b[this.keyField]) return -1;
          if (a[this.keyField] > b[this.keyField]) return 1;
          return 0;
        } else {
          if (a[this.keyField] > b[this.keyField]) return -1;
          if (a[this.keyField] < b[this.keyField]) return 1;
          return 0;
        }
      });
    }

    //----------------------------------------------------------------------
    //
    //  Internal methods
    //
    //----------------------------------------------------------------------

    _searchIndex(key: any): number {
      const cmp = (key1: any, key2: any) => {
        if (!this._desc) {
          if (key1 < key2) return -1;
          if (key1 > key2) return 1;
          return 0;
        } else {
          if (key1 > key2) return -1;
          if (key1 < key2) return 1;
          return 0;
        }
      };

      let head = 0;
      let tail = this.length - 1;
      while (head <= tail) {
        const where = head + Math.floor((tail - head) / 2);
        const c = cmp(this[where][this.keyField], key);
        if (0 === c) {
          return where;
        }
        if (0 < c) tail = where - 1;
        else head = where + 1;
      }
      return -1;
    }
  }

}

export default collection;
