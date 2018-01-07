const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const shell = require('gulp-shell');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

//----------------------------------------------------------------------
//
//  Tasks
//
//----------------------------------------------------------------------

//--------------------------------------------------
//  ビルドタスク
//--------------------------------------------------

/**
 * ライブラリのビルドを行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean:ts',
    'compile',
    'copy-to-lib',
    'clean:ts',
    done
  );
});

/**
 * libディレクトリ内のtsファイルのコンパイルを実行します。
 */
gulp.task('compile',
  shell.task([
    './node_modules/.bin/tslint -p tslint.json',
    './node_modules/.bin/tsc --project ./tsconfig.json',
  ], {
    verbose: true,
  })
);

/**
 * libディレクトリへ必要なリソースをコピーします。
 */
gulp.task('copy-to-lib', () => {
  return gulp.src([
    './src/**/*.js',
    './src/serviceAccountKey.json',
  ], {base: 'src'})
    .pipe(gulp.dest('lib'));
});

//--------------------------------------------------
//  テストタスク
//--------------------------------------------------

/**
 * 開発を行うためのタスクを起動します。
 */
gulp.task('test', (done) => {
  return sequence(
    'clean:ts',
    'test:bundle',
    'test:mocha',
    done);
});

/**
 * testディレクトリのソースをバンドルします。
 */
gulp.task('test:bundle', () => {
  return bundle();
});

/**
 * mochaで単体テストを実行します。
 */
gulp.task('test:mocha',
  shell.task([
    './node_modules/.bin/mocha --ui tdd test/index.bundle.js',
  ], {
    verbose: true,
  })
);

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * TypeScriptのコンパイルで出力されたファイルをクリーンします。
 */
gulp.task('clean:ts', () => {
  return del.sync([
    './src/**/{*.js,*.js.map,*.d.ts}',
    './test/**/{*.js,*.js.map,*.d.ts}',
    '!./**/typings.d.ts',
  ]);
});

//----------------------------------------------------------------------
//
//  Functions
//
//----------------------------------------------------------------------

/**
 * パッケージをバンドルします。
 */
function bundle() {
  return webpackStream({
    entry: {
      'index': `./test/index`,
    },
    output: {
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          // ローダーの処理対象から外すディレクトリ
          exclude: [/node_modules/],
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
              transpileOnly: true,
            },
          }],
        }
      ]
    },
    devtool: 'inline-source-map',
    // ビルトインの path, fs, …といったモジュールを無視する
    target: 'node',
    // node_modulesフォルダのすべてのモジュールを無視する
    externals: [nodeExternals()],
  }, webpack)
    .pipe(gulp.dest('test'));
}
