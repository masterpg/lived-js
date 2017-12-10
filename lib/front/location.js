"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("qs");
const location_types_1 = require("./location-types");
var location_types_2 = require("./location-types");
exports.Location = location_types_2.LocationData;
/**
 * ロケーションを変更します。
 * @param path 変更するパスを指定します。
 * @param query 変更するパスに付与するクエリオブジェクトを指定します。
 */
function moveTo(path, query = {}) {
    let url = path;
    if (Object.keys(query).length) {
        url += `?${qs.stringify(query)}`;
    }
    window.history.pushState({}, '', url);
    window.dispatchEvent(new CustomEvent('location-changed'));
}
exports.moveTo = moveTo;
/**
 * 指定されたurlをパースし、その情報を取得します。
 * @param url
 */
function parse(url) {
    let anchor = document.createElement('a');
    anchor.href = url;
    return new location_types_1.LocationData(anchor);
}
exports.parse = parse;
/**
 * 指定されたパスのベースを取得します。
 * 例: "/foo/bar/index.html"が指定された場合、"index.html"が返されます。
 * @param path パスを指定します。
 */
function getBase(path) {
    return parse(path).base;
}
exports.getBase = getBase;
/**
 * 指定されたパスから拡張子を取得します。
 * 例: "/foo/bar/index.html"が指定された場合、".html"が返されます。
 * @param path パスを指定します。
 */
function getExt(path) {
    return parse(path).ext;
}
exports.getExt = getExt;
/**
 * 指定されたパスからディレクトリを取得します。
 * 例: "/foo/bar/index.html"が指定された場合、"/foo/bar"が返されます。
 * @param path パスを指定します。
 */
function getDir(path) {
    return parse(path).dir;
}
exports.getDir = getDir;
/**
 * 指定されたパスをURLに変換します。
 * @param path
 */
function toUrl(path) {
    return parse(path).url;
}
exports.toUrl = toUrl;
/**
 * 指定されたURLをパスに変換します。
 * 例: "http://localhost:5000/foo/bar/index.html"が指定された場合、
 *     "/foo/bar/index.html"が返されます。
 * @param url
 */
function toPath(url) {
    return parse(url).path;
}
exports.toPath = toPath;
/**
 * 現在のワーキングディレクトリをパスで取得します。
 */
function cwd() {
    return getDir(parse(window.location.href).path);
}
exports.cwd = cwd;
/**
 * 指定されたパスを連結します。
 * @param args
 */
function join(...args) {
    if (args.length <= 1) {
        args.unshift(cwd());
    }
    let path = '';
    for (let i = 0; i < args.length; i += 1) {
        let segment = args[i];
        if (!path) {
            path += segment;
        }
        else {
            path += '/' + segment;
        }
    }
    return __normalize(path);
}
exports.join = join;
/**
 * 指定されたパスを配列に分割します。
 * @param path
 */
function split(path) {
    let isAbsolutePath = __isAbsolute(path);
    return __normalizeArray(path.split('/'), !isAbsolutePath);
}
exports.split = split;
//----------------------------------------------------------------------
//
//  Internal methods
//
//----------------------------------------------------------------------
/**
 * normalize path
 */
function __normalize(path) {
    let isAbsolutePath = __isAbsolute(path);
    let trailingSlash = path && path[path.length - 1] === '/';
    path = __normalizeArray(path.split('/'), !isAbsolutePath).join('/');
    if (!path && !isAbsolutePath) {
        path += '.';
    }
    if (path && trailingSlash) {
        path += '/';
    }
    return (isAbsolutePath ? '/' : '') + path;
}
/**
 * normalize array
 * @param parts
 * @param allowAboveRoot
 */
function __normalizeArray(parts, allowAboveRoot) {
    let res = [];
    for (let i = 0; i < parts.length; i += 1) {
        let p = parts[i];
        if (!p || p === '.')
            continue;
        if (p === '..') {
            if (res.length && res[res.length - 1] !== '..') {
                res.pop();
            }
            else if (allowAboveRoot) {
                res.push('..');
            }
        }
        else if (/^http(s)?:/.test(p)) {
            res.push(p + '/');
        }
        else {
            res.push(p);
        }
    }
    return res;
}
/**
 * 指定されたパスが絶対パスかを否かを取得します。
 */
function __isAbsolute(path) {
    return path.charAt(0) === '/';
}
