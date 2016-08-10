var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['uglify'], function () {
  return gulp.src('src/Main.js').pipe(gulp.dest('bin'));
});

gulp.task('uglify', ['concat'], function () {
  return gulp.src('bin/lambda.js').pipe(uglify({
    wrap: 'exports',
  })).pipe(rename('lambda.min.js')).pipe(gulp.dest('bin'));
});

gulp.task('concat', ['lint'], function () {
  return gulp.src([
    'src/Errors.js',
    'src/Utilities.js',
    'src/Context.js',
    'src/Values.js',
    'src/Types.js',
    'src/AST.js',
    'src/Lexer.js',
    'src/Parser.js',
  ]).pipe(concat('lambda.js')).pipe(gulp.dest('bin'));
});

gulp.task('lint', function () {
  return gulp.src('src/*.js').pipe(eslint({
    rules: {
      'no-dupe-args': 2,
      // TODO
    },
  })).pipe(eslint.format()).pipe(eslint.failAfterError());
});

gulp.task('clean', function () {
  return del('bin');
});
