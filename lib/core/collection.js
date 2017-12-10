"use strict";
var collection;
(function (collection) {
    /**
     * Arrayの拡張クラスです。
     */
    class List extends Array {
        //----------------------------------------------------------------------
        //
        //  Constructors
        //
        //----------------------------------------------------------------------
        /**
         * アイテムデータリストのインスタンスを生成します。
         * @param items
         *   アイテムデータリストのもとになるアイテムリストを指定します(任意)。
         * @param keyField
         *   リスト内のアイテムを特定するキーとなるフィールドを指定します(任意)。
         *   指定しないかった場合はデフォルトで"id"がキーフィールドになります。
         */
        constructor(items, keyField) {
            super();
            this.keyField = keyField ? keyField : 'id';
            if (items) {
                this.addAll(items);
            }
        }
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
        getItemByKey(key, binarySearch) {
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
        getIndexByKey(key, binarySearch) {
            if (binarySearch) {
                return this._searchIndex(key);
            }
            else {
                let keyField = this.keyField;
                for (let i = 0; i < this.length; i++) {
                    if (this[i][keyField] == key) {
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
        removeItem(index_or_item) {
            let index;
            if (isNaN(index_or_item)) {
                index = this.indexOf(index_or_item);
            }
            else {
                index = index_or_item;
            }
            if (index >= 0) {
                return this.splice(index, 1)[0];
            }
            else {
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
        removeItemByKey(key, binarySearch) {
            const index = this.getIndexByKey(key, binarySearch);
            return this.removeItem(index);
        }
        /**
         * 指定されたインデックスにアイテムを挿入します。
         * @param index 挿入位置のインデックスを指定します。
         * @param item 挿入するアイテムを指定します。
         */
        insertItem(index, item) {
            this.splice(index, 0, item);
        }
        /**
         * 指定されたアイテムがリストに含まれているかを取得します。
         * @param item
         */
        contains(item) {
            return this.indexOf(item) >= 0;
        }
        /**
         * 指定されたキーで特定されるアイテムがリストに含まれているかを取得します。
         * @param key キーを指定します。
         * @param binarySearch
         *   バイナリサーチを行う場合はtrueを指定します。
         *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
         */
        containsByKey(key, binarySearch) {
            let index = this.getIndexByKey(key, binarySearch);
            return index >= 0;
        }
        /**
         * リストをクリアします。
         */
        clear() {
            this.splice(0, this.length);
        }
        /**
         * 指定された配列を連結します。
         * @param items
         */
        addAll(items) {
            for (let i = 0; i < items.length; i++) {
                this.push(items[i]);
            }
        }
        /**
         * キーでアイテムをソートします。
         * @param desc
         */
        sortItems(desc) {
            this._desc = desc ? desc : false;
            this.sort((a, b) => {
                if (!this._desc) {
                    if (a[this.keyField] < b[this.keyField])
                        return -1;
                    if (a[this.keyField] > b[this.keyField])
                        return 1;
                    return 0;
                }
                else {
                    if (a[this.keyField] > b[this.keyField])
                        return -1;
                    if (a[this.keyField] < b[this.keyField])
                        return 1;
                    return 0;
                }
            });
        }
        //----------------------------------------------------------------------
        //
        //  Internal methods
        //
        //----------------------------------------------------------------------
        _searchIndex(key) {
            let cmp = (key1, key2) => {
                if (!this._desc) {
                    if (key1 < key2)
                        return -1;
                    if (key1 > key2)
                        return 1;
                    return 0;
                }
                else {
                    if (key1 > key2)
                        return -1;
                    if (key1 < key2)
                        return 1;
                    return 0;
                }
            };
            let head = 0;
            let tail = this.length - 1;
            while (head <= tail) {
                const where = head + Math.floor((tail - head) / 2);
                const c = cmp(this[where][this.keyField], key);
                if (0 == c) {
                    return where;
                }
                if (0 < c)
                    tail = where - 1;
                else
                    head = where + 1;
            }
            return -1;
        }
    }
    collection.List = List;
})(collection || (collection = {}));
module.exports = collection;
