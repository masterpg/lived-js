import * as qs from 'qs';

export class LocationData {
  constructor(src?: Location | HTMLAnchorElement) {
    if (!src) {
      return;
    }

    const REG_BASE = /([^/?#]*)$/;
    const REG_DIR = /(?:([^?#]*)\/)*/;
    const REG_EXT = /(?:[^./]+)(\.[^/.]+)$/;

    this.url = src.href;
    this.protocol = src.protocol;
    this.domain = src.hostname;
    this.port = src.port;
    this.path = decodeURIComponent(src.pathname);
    this.hash = decodeURIComponent(src.hash.substring(1));
    this.host = src.host;

    const testedDir = REG_DIR.exec(this.path);
    this.dir = testedDir ? decodeURIComponent(testedDir[1]) : '';

    const testedBase = REG_BASE.exec(this.path);
    this.base = testedBase ? decodeURIComponent(testedBase[1]) : '';

    const testedExt = REG_EXT.exec(this.path);
    this.ext = testedExt ? decodeURIComponent(testedExt[1]) : '';

    this.query = qs.parse(src.search.substring(1));
  }

  url: string;
  protocol: string;
  domain: string;
  port: string;
  host: string;
  path: string;
  hash: string;
  dir: string;
  base: string;
  ext: string;
  query: any;
}
