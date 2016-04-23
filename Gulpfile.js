var gulp = require('gulp');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var del = require('del');
var mkdirp = require('mkdirp');
var nodeunit = require('gulp-nodeunit');

gulp.task('default', ['beautify', 'build']);

gulp.task('clean', function () {
  return del('bin');
});

gulp.task('test', ['default'], function () {
  return gulp.src('test/*.js').pipe(nodeunit());
});

gulp.task('beautify', ['beautify-src', 'beautify-test']);

gulp.task('beautify-src', function () {
  return gulp.src('src/*.js').pipe(beautify()).pipe(gulp.dest('src'));
});

gulp.task('beautify-test', function () {
  return gulp.src('test/*.js').pipe(beautify()).pipe(gulp.dest('test'));
});

gulp.task('bin', function () {
  return new Promise(function (resolve, reject) {
    mkdirp('bin', function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

gulp.task('concat', ['bin'], function () {
  return gulp.src([
    'src/Errors.js',
    'src/Utilities.js',
    'src/Context.js',
    'src/Types.js',
    'src/Values.js',
    'src/AST.js',
    'src/Operators.js',
    'src/DefaultContext.js',
    'src/Lexer.js',
    'src/Parser.js',
    'src/Bootstrap.js',
    'src/Strings.js',
    'src/Arrays.js',
  ]).pipe(concat('lambda.js')).pipe(gulp.dest('bin'));
});

gulp.task('lint', ['lint-src', 'lint-test']);

gulp.task('lint-src', ['concat'], function () {
  return gulp.src('bin/lambda.js').pipe(jshint({
    predef: {
      exports: false
    }
  })).pipe(jshint.reporter('default'));
});

gulp.task('lint-test', ['concat'], function () {
  return gulp.src('test/*.js').pipe(jshint({
    node: true
  })).pipe(jshint.reporter('default'));
});

gulp.task('uglify', ['lint'], function () {
  return gulp.src('bin/lambda.js').pipe(uglify({
    wrap: 'exports'
  })).pipe(rename('lambda.min.js')).pipe(gulp.dest('bin'));
});

gulp.task('main', function () {
  return gulp.src('src/Main.js').pipe(gulp.dest('bin'));
});

gulp.task('build', ['uglify', 'main']);
