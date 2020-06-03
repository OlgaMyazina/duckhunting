'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var del = require('del');


var paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: './css',
  },
  htmls: {
    src: 'src/**/*.html',
    dest: './',
  }
};

async function clean() {
  return function () {
    del(['css/**/*.css']);
    del(['*.html']);
  }()
}

const styles = gulp.series(clean, function () {
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
});

const copyHtml = function () {
  return gulp.src(paths.htmls.src)
    .pipe(gulp.dest(paths.htmls.dest));
};

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.htmls.src, copyHtml);
  gulp.watch('*.html').on('change', server.reload)
}

const serv = function () {
  return server.init({
    server: {
      baseDir: '.',
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
};

var build = gulp.series(clean, styles, copyHtml, serv);


exports.clean = clean;
exports.styles = styles;
exports.copyHtml = copyHtml;
exports.serv = serv;
exports.watch = watch;
exports.build = build;

exports.default = build;
