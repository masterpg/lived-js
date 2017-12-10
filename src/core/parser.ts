import * as _ from 'lodash';
import {TextEncoder} from 'text-encoding';

//----------------------------------------------------------------------
//
//  Methods
//
//----------------------------------------------------------------------

/**
 * 文字列をUTF8バイト配列に変換します。
 */
export function textToBytes(text: string, encoding: string = 'utf-8'): Uint8Array {
  return new TextEncoder(encoding).encode(text);
}

/**
 * UTF8のバイト配列を文字列に変換します。
 */
export function bytesToText(bytes: Uint8Array, encoding: string = 'utf-8'): string {
  return new TextDecoder(encoding).decode(bytes);
}

/**
 * UTF8のバイト配列を16進数文字列に変換します。
 */
export function bytesToHex(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    const part = byte < 16 ? '0' : '';
    result += (part + byte.toString(16));
  }
  return result;
}

/**
 * 16進数文字列からバイト配列を作成します。
 */
export function hexToBytes(hex: string): Uint8Array {
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

/**
 * パラメータオブジェクトをクエリストリングへ変換します。
 * paramsが空だった場合は空白文字('')が返されます。
 * @param object
 */
export function objectToQueryString(object: {} | null | undefined): string {
  if (!object || Object.keys(object).length == 0) {
    return '';
  }

  const queryParts: string[] = [];
  for (let param in object) {
    const value = object[param];
    param = encodeURIComponent(param);
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        queryParts.push(`${param}=${encodeURIComponent(value[i])}`);
      }
    } else if (value !== null) {
      queryParts.push(`${param}=${encodeURIComponent(value)}`);
    } else {
      queryParts.push(param);
    }
  }
  return queryParts.join('&');
}

/**
 * UTF8のバイト配列をJSONオブジェクトへ変換します。
 * @param buff
 */
export function bytesToJSON(buff: Uint8Array): any {
  const text = bytesToText(buff);
  return JSON.parse(text);
}

/**
 * バイト配列をArrayBufferへ変換します。
 * @param buff
 */
export function bytesToArrayBuffer(buff: Uint8Array): ArrayBuffer {
  return buff.buffer.slice(0, buff.byteLength);
}

/**
 * バイト配列をBlobへ変換します。
 * @param buff
 * @param mimeType
 */
export function bytesToBlob(buff: Uint8Array, mimeType: string): Blob {
  let blob: Blob;
  try {
    blob = new Blob([buff], {type: mimeType});
  } catch (err) {
    throw new Error('Uint8ArrayからBlobへの変換に失敗しました: ' + err);
  }
  return blob;
}

/**
 * バイト配列をDocumentへ変換します。
 * @param buff
 * @param mimeType
 */
export function bytesToDocument(buff: Uint8Array, mimeType: string): Document {
  const text = bytesToText(buff);
  const parser = new DOMParser();
  let doc: Document;
  try {
    doc = parser.parseFromString(text, mimeType);
  } catch (err) {
    throw new Error('Uint8ArrayからDocumentへの変換に失敗しました: ' + err);
  }
  if (doc.getElementsByTagName("parsererror").length) {
    throw new Error('Uint8ArrayからDocumentへの変換に失敗しました。');
  }
  return doc;
}

/**
 * バイト配列をXMLDocumentへ変換します。
 * @param buff
 */
export function bytesToXML(buff: Uint8Array): XMLDocument {
  const text = bytesToText(buff);
  const parser = new DOMParser();
  let xml: XMLDocument;
  try {
    xml = parser.parseFromString(text, 'application/xml') as XMLDocument;
  } catch (err) {
    throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました: ' + err);
  }
  if (xml.getElementsByTagName("parsererror").length) {
    throw new Error('Uint8ArrayからXMLDocumentへの変換に失敗しました。');
  }
  return xml;
}


