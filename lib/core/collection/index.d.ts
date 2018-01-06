declare namespace collection {
    /**
     * Arrayの拡張クラスです。
     */
    class List<T> extends Array<T> {
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
        _desc: boolean;
        /**
         * リスト内のアイテムを特定するキーとなるフィールドです。
         */
        keyField: string;
        /**
         * 指定されたキーでアイテムを取得します。
         * @param key キーを指定します。
         * @param binarySearch
         *   バイナリサーチを行う場合はtrueを指定します。
         *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
         */
        getItemByKey(key: any, binarySearch?: boolean): T | null;
        /**
         * 指定されたキーでアイテムデータのインデックスを取得します。
         * @param key キーを指定します。
         * @param binarySearch
         *   バイナリサーチを行う場合はtrueを指定します。
         *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
         */
        getIndexByKey(key: any, binarySearch?: boolean): number;
        /**
         * アイテムをリストから削除します。
         * @param index_or_item 削除対象のインデックスまたはアイテムを指定します。
         * @returns 削除されたアイテムを返します。
         */
        removeItem(index_or_item: number | T): T | null;
        /**
         * 指定されたキーで特定されるアイテムをリストから削除します。
         * @param key アイテムを特定するキーを指定します。
         * @param binarySearch
         *   バイナリサーチを行う場合はtrueを指定します。
         *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
         * @returns 削除されたアイテムを返します。
         */
        removeItemByKey(key: any, binarySearch?: boolean): T | null;
        /**
         * 指定されたインデックスにアイテムを挿入します。
         * @param index 挿入位置のインデックスを指定します。
         * @param item 挿入するアイテムを指定します。
         */
        insertItem(index: number, item: T): void;
        /**
         * 指定されたアイテムがリストに含まれているかを取得します。
         * @param item
         */
        contains(item: T): boolean;
        /**
         * 指定されたキーで特定されるアイテムがリストに含まれているかを取得します。
         * @param key キーを指定します。
         * @param binarySearch
         *   バイナリサーチを行う場合はtrueを指定します。
         *   バイナリサーチは事前にsortItems()でリストをソートしておく必要があります。
         */
        containsByKey(key: any, binarySearch?: boolean): boolean;
        /**
         * リストをクリアします。
         */
        clear(): void;
        /**
         * 指定された配列を連結します。
         * @param items
         */
        addAll<U extends T>(items: U[]): void;
        /**
         * キーでアイテムをソートします。
         * @param desc
         */
        sortItems(desc?: boolean): void;
        _searchIndex(key: any): number;
    }
}
export default collection;
