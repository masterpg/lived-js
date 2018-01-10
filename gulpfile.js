const gulp = require('gulp');
const path = require('path');
const del = require('del');
const vfs = require('vinyl-fs');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const shell = require('gulp-shell');
const exec = require('exec-chainable');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

//----------------------------------------------------------------------
//
//  Constants
//
//----------------------------------------------------------------------

/**
 * WEB公開ディレクトリです。
 */
const PUBLIC_DIR = 'public';

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
    'build:resources',
    'clean:ts',
    done
  );
});

/**
 * TypeScriptのコンパイルを行います。
 */
gulp.task('compile',
  shell.task(
    [
      'node_modules/.bin/tslint -p tslint.json',
      'node_modules/.bin/tsc --project tsconfig.json --declaration',
    ],
    {verbose: true}
  )
);

/**
 * libディレクトリへ必要なリソースを配置します。
 */
gulp.task('build:resources', () => {
  return gulp.src([
    'src/**/*.js',
    'src/**/*.d.ts',
    '!src/typings.d.ts',
  ], {base: 'src'})
    .pipe(gulp.dest('lib'));
});

//--------------------------------------------------
//  ライブラリの開発タスク
//--------------------------------------------------

/**
 * 開発を行うためのタスクを起動します。
 */
gulp.task('dev', (done) => {
  return sequence(
    'clean:ts',
    [
      'dev:bundle:test',
      'dev:bundle:demo',
      'dev:resources',
      'dev:serve',
    ],
    done
  );
});

/**
 * testディレクトリのソースをバンドルします。
 */
gulp.task('dev:bundle:test', () => {
  return merge(
    bundle('test/core'),
    bundle('test/front')
  );
});

/**
 * demoディレクトリのソースをバンドルします。
 */
gulp.task('dev:bundle:demo', () => {
  return merge(
    bundle('demo')
  );
});

/**
 * WEB公開ディレクトリへ必要なリソースを配置します。
 */
gulp.task('dev:resources', (done) => {
  return sequence(
    [
      'test:resources',
      'demo:resources',
    ],
    done
  );
});

/**
 * WEB公開ディレクトリへtestで必要なリソースを配置します。
 */
gulp.task('test:resources', () => {
  // bower_componentsディレクトリのシンボリックリンクを作成
  const bower = vfs.src('bower_components', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));

  // testディレクトリのシンボリックリンクを作成
  const test = vfs.src('test', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));

  return merge(bower, test);
});

/**
 * WEB公開ディレクトリへdemoで必要なリソースを配置します。
 */
gulp.task('demo:resources', () => {
  // demoディレクトリのシンボリックリンクを作成
  const demo = vfs.src('demo', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));

  return merge(demo);
});

/**
 * 開発用のローカルサーバーを起動します。
 */
gulp.task('dev:serve',
  shell.task([
    'firebase serve --only functions,hosting --port 5000 --host localhost',
  ], {
    verbose: true,
  })
);

//--------------------------------------------------
//  Firebaseのデプロイ
//--------------------------------------------------

/**
 * デプロイ処理を実行します。
 */
gulp.task('deploy', (done) => {
  return sequence(
    'deploy:hosting',
    'deploy:functions',
    done
  );
});

/**
 * Hostingのデプロイ処理を実行します。
 */
gulp.task('deploy:hosting', (done) => {
  return sequence(
    'demo:resources',
    'cmd:deploy:hosting',
    done
  );
});

/**
 * Functionsのデプロイ処理を実行します。
 */
gulp.task('deploy:functions', (done) => {
  return sequence(
    'cmd:deploy:functions',
    done
  );
});

gulp.task('cmd:deploy:hosting',
  shell.task(
    'firebase deploy --only hosting',
    {verbose: true}
  )
);

gulp.task('cmd:deploy:functions',
  shell.task(
    'firebase deploy --only functions',
    {verbose: true}
  )
);

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * TypeScriptのコンパイルで出力されたファイルをクリーンします。
 */
gulp.task('clean:ts', () => {
  return del.sync([
    'src/**/{*.js,*.js.map,*.d.ts}',
    'test/**/{*.js,*.js.map,*.d.ts}',
    '!**/typings.d.ts',
  ]);
});

//----------------------------------------------------------------------
//
//  Functions
//
//----------------------------------------------------------------------

/**
 * 指定されたディレクトリのソースをバンドルします。
 * @param directory
 */
function bundle(directory) {
  return webpackStream({
    entry: {
      'index': path.join(directory, 'index'),
    },
    output: {
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin({configFile: 'tsconfig.json'})]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          // ローダーの処理対象から外すディレクトリ
          exclude: [/node_modules/, /bower_components/],
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          }],
        }
      ]
    },
    devtool: 'inline-source-map',
    watch: true,
  }, webpack)
    .pipe(gulp.dest(directory));
}
