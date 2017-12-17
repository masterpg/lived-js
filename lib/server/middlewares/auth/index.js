"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
/**
 * このリスナはExpressのミドルウェアで、認証HTTPヘッダーで渡されるFirebase IDトークンを検証します。
 * Firebase IDトークンは次のように、認証HTTPヘッダーでBearerトークンとして渡されなくてはなりません:
 * `Authorization: Bearer <Firebase ID Token>`
 * デコードが成功すると、`req.user`としてIDトークンのコンテンツに追加されます。
 */
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // 認証リクエストがFirebase IDトークンを持っているかチェック
        const authorization = req.headers['authorization'];
        if ((!authorization || !authorization.startsWith('Bearer ')) && !req.cookies.__session) {
            console.error('認証ヘッダーにBearerトークンとしてFirebase IDが渡されませんでした。', 'HTTPヘッダーの`Authorization: Bearer <Firebase ID Token>`でリクエストを承認するか、', 'cookieの`__session`で承認を行ってください。');
            res.status(403).send('Unauthorized');
            return;
        }
        let idToken;
        // 認証ヘッダーにBearerトークンがある場合、認証ヘッダーからIDトークンを取得
        if (authorization && authorization.startsWith('Bearer ')) {
            idToken = authorization.split('Bearer ')[1];
        }
        else {
            idToken = req.cookies.__session;
        }
        // IDトークンの検証とデコード
        let decodedIdToken;
        try {
            decodedIdToken = yield admin.auth().verifyIdToken(idToken);
        }
        catch (err) {
            console.error('Firebase IDトークンの検証中にエラーが発生しました:', err);
            res.status(403).send('Unauthorized');
            return;
        }
        req.user = decodedIdToken;
        console.log('decodedIdToken:', decodedIdToken);
        next();
    });
}
exports.default = default_1;
