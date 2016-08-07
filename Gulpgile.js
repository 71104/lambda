var gulp = require('gulp');
var del = require('del');
var eslint = require('eslint');
var uglify = require('gulp-uglify');

gulp.task('default', ['uglify']);

gulp.task('uglify', ['lint'], function () {
  // TODO
});

gulp.task('lint', function () {
  // TODO
});

gulp.task('clean', function () {
  return del('bin');
});
