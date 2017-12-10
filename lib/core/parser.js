"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const text_encoding_1 = require("text-encoding");
//----------------------------------------------------------------------
//
//  Methods
//
//----------------------------------------------------------------------
/**
 * 文字列をUTF8バイト配列に変換します。
 */
function textToBytes(text, encoding = 'utf-8') {
    return new text_encoding_1.TextEncoder(encoding).encode(text);
}
exports.textToBytes = textToBytes;
/**
 * UTF8のバイト配列を文字列に変換します。
 */
function bytesToText(bytes, encoding = 'utf-8') {
    return new TextDecoder(encoding).decode(bytes);
}
exports.bytesToText = bytesToText;
/**
 * UTF8のバイト配列を16進数文字列に変換します。
 */
function bytesToHex(bytes) {
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        const part = byte < 16 ? '0' : '';
        result += (part + byte.toString(16));
    }
    return result;
}
exports.bytesToHex = bytesToHex;
/**
 * 16進数文字列からバイト配列を作成します。
 */
function hexToBytes(hex) {
    if ((hex.length % 2) != 0) {
        hex = _.padStart(hex, hex.length + 1, '0');
    }
    let result = new Uint8Array(Math.floor(hex.length / 2));
    for (let i = 0; i < hex.length; i += 2) {
        const num = hex.substring(i, i + 2);
        result[Math.floor(i / 2)] = parseInt(num, 16);
    }
    return result;
}
exports.hexToBytes = hexToBytes;
/**
 * パラメータオブジェクトをクエリストリングへ変換します。
 * paramsが空だった場合は空白文字('')が返されます。
 * @param object
 */
function objectToQueryString(object) {
    if (!object || Object.keys(object).length == 0) {
        return '';
    }
    const queryParts = [];
    for (let param in object) {
        const value = object[param];
        param = encodeURIComponent(param);
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                queryParts.push(`${param}=${encodeURIComponent(value[i])}`);
            }
        }
        else if (value !== null) {
            queryParts.push(`${param}=${encodeURIComponent(value)}`);
        }
        else {
            queryParts.push(param);
        }
    }
    return queryParts.join('&');
}
exports.objectToQueryString = objectToQueryString;
/**
 * UTF8のバイト配列をJSONオブジェクトへ変換します。
 * @param buff
 */
function bytesToJSON(buff) {
    const text = bytesToText(buff);
    return JSON.parse(text);
}
exports.bytesToJSON = bytesToJSON;
/**
 * バイト配列をArrayBufferへ変換します。
 * @param buff
 */
function bytesToArrayBuffer(buff) {
    return buff.buffer.slice(0, buff.byteLength);
}
exports.bytesToArrayBuffer = bytesToArrayBuffer;
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
exports.bytesToBlob = bytesToBlob;
/**
 * バイト配列をDocumentへ変換します。
 * @param buff
 * @param mimeType
 */
function bytesToDocument(buff, mimeType) {
    const text = bytesToText(buff);
    const parser = new DOMParser();
    let doc;
    try {
        doc = parser.parseFromString(text, mimeType);
    }
    catch (err) {
        throw new Error('Uint8ArrayからDocumentへの変換に失敗しました: ' + err);
    }
    if (doc.getElementsByTagName("parsererror").length) {
        throw new Error('Uint8ArrayからDocumentへの変換に失敗しました。');
    }
    return doc;
}
exports.bytesToDocument = bytesToDocument;
/**
 * バイト配列をXMLDocumentへ変換します。
 * @param buff
 */
function bytesToXML(buff) {
    const text = bytesToText(buff);
    const parser = new DOMParser();
    let xml;
    try {
        xml = parser.parseFromString(text, 'application/xml');
    }
    catch (err) {
        throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました: ' + err);
    }
    if (xml.getElementsByTagName("parsererror").length) {
        throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました。');
    }
    return xml;
}
exports.bytesToXML = bytesToXML;
