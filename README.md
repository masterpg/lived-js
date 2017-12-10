# lived-js

## 環境構築

yarnをインストールします。

```console
$ npm install -g yarn
```

プロジェクトの依存パッケージをインストールします。

```console
$ yarn install
```

Bowerをインストールします。

```console
$ npm install -g bower
```

プロジェクトの依存パッケージをインストールします。

```console
$ bower install
```


## 開発サーバー

開発サーバーを起動します。

```console
$ gulp dev
```

起動したらブラウザで http://localhost:5000/test/index.html にアクセスすることで単体テストが実行されます。


## コンパイル

次のコマンドでソースファイルのコンパイルを行います。

```console
$ gulp compile
```

コンパイル結果が`lib/`に出力されます。本ライブラリを利用するアプリケーションはこの`lib/`配下に出力されたファイルを参照することになります。

