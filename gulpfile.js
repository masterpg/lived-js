const gulp = require('gulp');
const path = require('path');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const shell = require('gulp-shell');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync');

//----------------------------------------------------------------------
//
//  Tasks
//
//----------------------------------------------------------------------

/**
 * srcディレクトリ内のtsファイルのコンパイルを行います。
 */
gulp.task('compile', shell.task([
  'cd src && ../node_modules/.bin/tsc --project ../tsconfig.json --declaration --outDir ../lib',
]));

/**
 * 開発(コーディング)時はこのタスクを実行しておきます。
 */
gulp.task('dev', (done) => {
  return sequence(
    [
      'compile:test',
      'browser-sync'
    ],
    done);
});

/**
 * browser-syncを起動します。
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    port: 5000,
    ui: {port: 5005},
    open: false,
    server: {
      baseDir: './',
    }
  });
});

/**
 * testディレクトリ内のtsファイルをwebpackでコンパイルします。
 */
gulp.task('compile:test', () => {
  return merge(
    compile('core'),
    compile('front')
  );
});

/**
 *
 * @param target
 */
function compile(target) {
  return webpackStream({
    entry: {
      'index-test': `./test/${target}/index-test`,
    },
    output: {
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    devtool: 'inline-source-map',
    watch: true,
  }, webpack)
    .pipe(gulp.dest(`test/${target}`));
}
