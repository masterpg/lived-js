"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const text_encoding_1 = require("text-encoding");
var parser;
(function (parser) {
    /**
     * 文字列をUTF8バイト配列に変換します。
     */
    function textToBytes(text, encoding = 'utf-8') {
        return new text_encoding_1.TextEncoder(encoding).encode(text);
    }
    parser.textToBytes = textToBytes;
    /**
     * UTF8のバイト配列を文字列に変換します。
     */
    function bytesToText(bytes, encoding = 'utf-8') {
        return new TextDecoder(encoding).decode(bytes);
    }
    parser.bytesToText = bytesToText;
    /**
     * UTF8のバイト配列を16進数文字列に変換します。
     */
    function bytesToHex(bytes) {
        let result = '';
        for (const byte of bytes) {
            const part = byte < 16 ? '0' : '';
            result += (part + byte.toString(16));
        }
        return result;
    }
    parser.bytesToHex = bytesToHex;
    /**
     * 16進数文字列からバイト配列を作成します。
     */
    function hexToBytes(hex) {
        let hexStr = hex;
        if ((hexStr.length % 2) !== 0) {
            hexStr = _.padStart(hexStr, hexStr.length + 1, '0');
        }
        const result = new Uint8Array(Math.floor(hexStr.length / 2));
        for (let i = 0; i < hexStr.length; i += 2) {
            const num = hexStr.substring(i, i + 2);
            result[Math.floor(i / 2)] = parseInt(num, 16);
        }
        return result;
    }
    parser.hexToBytes = hexToBytes;
    /**
     * パラメータオブジェクトをクエリストリングへ変換します。
     * paramsが空だった場合は空白文字('')が返されます。
     * @param object
     */
    function objectToQueryString(object) {
        if (!object || Object.keys(object).length === 0) {
            return '';
        }
        const queryParts = [];
        for (let param in object) {
            const value = object[param];
            param = encodeURIComponent(param);
            if (Array.isArray(value)) {
                for (const v of value) {
                    queryParts.push(`${param}=${encodeURIComponent(v)}`);
                }
            }
            else if (!(value === undefined || value === null)) {
                queryParts.push(`${param}=${encodeURIComponent(value)}`);
            }
        }
        return queryParts.join('&');
    }
    parser.objectToQueryString = objectToQueryString;
    /**
     * UTF8のバイト配列をJSONオブジェクトへ変換します。
     * @param buff
     */
    function bytesToJSON(buff) {
        const text = bytesToText(buff);
        return JSON.parse(text);
    }
    parser.bytesToJSON = bytesToJSON;
    /**
     * バイト配列をArrayBufferへ変換します。
     * @param buff
     */
    function bytesToArrayBuffer(buff) {
        return buff.buffer.slice(0, buff.byteLength);
    }
    parser.bytesToArrayBuffer = bytesToArrayBuffer;
    /**
     * バイト配列をBlobへ変換します。
     * @param buff
     * @param mimeType
     */
    function bytesToBlob(buff, mimeType) {
        let blob;
        try {
            blob = new Blob([buff], { type: mimeType });
        }
        catch (err) {
            throw new Error('Uint8ArrayからBlobへの変換に失敗しました: ' + err);
        }
        return blob;
    }
    parser.bytesToBlob = bytesToBlob;
    /**
     * バイト配列をDocumentへ変換します。
     * @param buff
     * @param mimeType
     */
    function bytesToDocument(buff, mimeType) {
        const text = bytesToText(buff);
        const domParser = new DOMParser();
        let doc;
        try {
            doc = domParser.parseFromString(text, mimeType);
        }
        catch (err) {
            throw new Error('Uint8ArrayからDocumentへの変換に失敗しました: ' + err);
        }
        if (doc.getElementsByTagName("parsererror").length) {
            throw new Error('Uint8ArrayからDocumentへの変換に失敗しました。');
        }
        return doc;
    }
    parser.bytesToDocument = bytesToDocument;
    /**
     * バイト配列をXMLDocumentへ変換します。
     * @param buff
     */
    function bytesToXML(buff) {
        const text = bytesToText(buff);
        const domParser = new DOMParser();
        let xml;
        try {
            xml = domParser.parseFromString(text, 'application/xml');
        }
        catch (err) {
            throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました: ' + err);
        }
        if (xml.getElementsByTagName("parsererror").length) {
            throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました。');
        }
        return xml;
    }
    parser.bytesToXML = bytesToXML;
})(parser || (parser = {}));
exports.default = parser;
