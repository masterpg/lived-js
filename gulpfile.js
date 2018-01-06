const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const shell = require('gulp-shell');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

//----------------------------------------------------------------------
//
//  Tasks
//
//----------------------------------------------------------------------

//--------------------------------------------------
//  ライブラリのビルドタスク
//--------------------------------------------------

/**
 * ライブラリのビルドを行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean:ts',
    'compile',
    'clean:ts:test',
    done
  );
});

/**
 * srcディレクトリ内のtsファイルのコンパイルを実行します。
 */
gulp.task('compile',
  shell.task([
    './node_modules/.bin/tslint -p tslint.json',
    './node_modules/.bin/tsc --project ./tsconfig.json --declaration',
  ], {
    verbose: true,
  })
);

//--------------------------------------------------
//  ライブラリの開発タスク
//--------------------------------------------------

/**
 * 開発用のローカルサーバーを起動します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'clean:ts:test',
    [
      'serve:bundle',
      'serve:firebase'
    ],
    done);
});

/**
 * testディレクトリ内の各パッケージをバンドルします。
 */
gulp.task('serve:bundle', () => {
  return merge(
    bundle('core'),
    bundle('front')
  );
});

/**
 * firebaseのローカルサーバーを起動します。
 */
gulp.task('serve:firebase',
  shell.task([
    'firebase serve --only functions,hosting --port 5000 --host localhost',
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
gulp.task('clean:ts', ['clean:ts:lib', 'clean:ts:test']);

gulp.task('clean:ts:lib', () => {
  return del.sync([
    './lib/**/{*.js,*.js.map,*.d.ts}',
    '!./lib/typings.d.ts',
  ]);
});

gulp.task('clean:ts:test', () => {
  return del.sync([
    './test/**/{*.js,*.js.map,*.d.ts}',
  ]);
});

/**
 * デプロイ処理を実行します。
 */
gulp.task('deploy',
  shell.task([
    'firebase deploy --only functions',
  ], {
    verbose: true,
  })
);

//----------------------------------------------------------------------
//
//  Functions
//
//----------------------------------------------------------------------

/**
 * 指定されたパッケージをバンドルします。
 * @param package
 */
function bundle(package) {
  return webpackStream({
    entry: {
      'index': `./test/${package}/index`,
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
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          }],
          exclude: /node_modules/,
        }
      ]
    },
    devtool: 'inline-source-map',
    watch: true,
  }, webpack)
    .pipe(gulp.dest(`test/${package}`));
}
