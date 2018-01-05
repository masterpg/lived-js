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
    'copy-to-lib',
    'clean:ts',
    done
  );
});

/**
 * srcディレクトリ内のtsファイルのコンパイルを実行します。
 */
gulp.task('compile',
  shell.task([
    './node_modules/.bin/tsc --project ./tsconfig.json --declaration',
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
    './src/**/*.d.ts',
    '!./src/typings.d.ts',
  ], {base: 'src'})
    .pipe(gulp.dest('lib'));
});

//--------------------------------------------------
//  ライブラリの開発タスク
//--------------------------------------------------

/**
 * 開発用のローカルサーバーを起動します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'clean:ts',
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
gulp.task('clean:ts', function () {
  return del.sync([
    './src/**/{*.js,*.js.map,*.d.ts}',
    './test/**/{*.js,*.js.map,*.d.ts}',
    '!./src/typings.d.ts',
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
