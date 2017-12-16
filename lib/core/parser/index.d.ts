declare namespace parser {
    /**
     * 文字列をUTF8バイト配列に変換します。
     */
    function textToBytes(text: string, encoding?: string): Uint8Array;
    /**
     * UTF8のバイト配列を文字列に変換します。
     */
    function bytesToText(bytes: Uint8Array, encoding?: string): string;
    /**
     * UTF8のバイト配列を16進数文字列に変換します。
     */
    function bytesToHex(bytes: Uint8Array): string;
    /**
     * 16進数文字列からバイト配列を作成します。
     */
    function hexToBytes(hex: string): Uint8Array;
    /**
     * パラメータオブジェクトをクエリストリングへ変換します。
     * paramsが空だった場合は空白文字('')が返されます。
     * @param object
     */
    function objectToQueryString(object: {} | null | undefined): string;
    /**
     * UTF8のバイト配列をJSONオブジェクトへ変換します。
     * @param buff
     */
    function bytesToJSON(buff: Uint8Array): any;
    /**
     * バイト配列をArrayBufferへ変換します。
     * @param buff
     */
    function bytesToArrayBuffer(buff: Uint8Array): ArrayBuffer;
    /**
     * バイト配列をBlobへ変換します。
     * @param buff
     * @param mimeType
     */
    function bytesToBlob(buff: Uint8Array, mimeType: string): Blob;
    /**
     * バイト配列をDocumentへ変換します。
     * @param buff
     * @param mimeType
     */
    function bytesToDocument(buff: Uint8Array, mimeType: string): Document;
    /**
     * バイト配列をXMLDocumentへ変換します。
     * @param buff
     */
    function bytesToXML(buff: Uint8Array): XMLDocument;
}
export default parser;
