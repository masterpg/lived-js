/// <reference types="express" />
import * as functions from 'firebase-functions';
import * as express from 'express';
/**
 * このリスナはExpressのミドルウェアで、認証HTTPヘッダーで渡されるFirebase IDトークンを検証します。
 * Firebase IDトークンは次のように、認証HTTPヘッダーでBearerトークンとして渡されなくてはなりません:
 * `Authorization: Bearer <Firebase ID Token>`
 * デコードが成功すると、`req.user`としてIDトークンのコンテンツに追加されます。
 */
export default function (req: functions.Request, res: functions.Response, next: express.NextFunction): Promise<void>;
