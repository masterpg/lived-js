import { LocationData } from './types';
export { LocationData as Location } from './types';
export declare namespace location {
    /**
     * ロケーションを変更します。
     * @param path 変更するパスを指定します。
     * @param query 変更するパスに付与するクエリオブジェクトを指定します。
     */
    function moveTo(path: string, query?: {}): void;
    /**
     * 指定されたurlをパースし、その情報を取得します。
     * @param url
     */
    function parse(url: any): LocationData;
    /**
     * 指定されたパスのベースを取得します。
     * 例: "/foo/bar/index.html"が指定された場合、"index.html"が返されます。
     * @param path パスを指定します。
     */
    function getBase(path: string): string;
    /**
     * 指定されたパスから拡張子を取得します。
     * 例: "/foo/bar/index.html"が指定された場合、".html"が返されます。
     * @param path パスを指定します。
     */
    function getExt(path: string): string;
    /**
     * 指定されたパスからディレクトリを取得します。
     * 例: "/foo/bar/index.html"が指定された場合、"/foo/bar"が返されます。
     * @param path パスを指定します。
     */
    function getDir(path: string): string;
    /**
     * 指定されたパスをURLに変換します。
     * @param path
     */
    function toUrl(path: string): string;
    /**
     * 指定されたURLをパスに変換します。
     * 例: "http://localhost:5000/foo/bar/index.html"が指定された場合、
     *     "/foo/bar/index.html"が返されます。
     * @param url
     */
    function toPath(url: string): string;
    /**
     * 現在のワーキングディレクトリをパスで取得します。
     */
    function cwd(): string;
    /**
     * 指定されたパスを連結します。
     * @param args
     */
    function join(...args: string[]): string;
    /**
     * 指定されたパスを配列に分割します。
     * @param path
     */
    function split(path: string): string[];
}
