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
    'src/DefaultContext.js',
    'src/Lexer.js',
    'src/Parser.js',
  ]).pipe(concat('lambda.js')).pipe(gulp.dest('bin'));
});

gulp.task('lint', function () {
  return gulp.src('src/*.js').pipe(eslint({
    rules: {
      'no-dupe-args': 2,
      'no-dupe-keys': 2,
      'no-duplicate-case': 2,
      'no-extra-boolean-cast': 1,
      'no-extra-parens': 1,
      'no-extra-semi': 2,
      'no-func-assign': 1,
      'no-irregular-whitespace': 2,
      'no-negated-in-lhs': 1,
      'no-unexpected-multiline': 2,
      'no-unreachable': 2,
      'no-unsafe-finally': 2,
      'use-isnan': 2,
      'valid-jsdoc': 2,
      'valid-typeof': 2,
      'block-scoped-var': 2,
      'consistent-return': 1,
      'curly': 2,
      'dot-location': [1, 'property'],
      'dot-notation': 1,
      'guard-for-in': 1,
      'no-caller': 2,
      'no-case-declarations': 1,
      'no-empty-pattern': 1,
      'no-fallthrough': 1,
      'no-iterator': 2,
      'no-labels': 2,
      'no-lone-blocks': 1,
      'no-loop-func': 1,
      'no-multi-spaces': 2,
      'no-native-reassign': 2,
      'no-proto': 2,
      'no-redeclare': 1,
      'no-self-assign': 2,
      'no-self-compare': 2,
      'no-sequences': 1,
      'no-throw-literal': 1,
      'no-unmodified-loop-condition': 1,
      'no-unused-expressions': 2,
      'radix': 2,
      'wrap-iife': 1,
      'yoda': [1, 'always', {
        onlyEquality: true,
      }],
      'init-declarations': 2,
      'no-catch-shadow': 1,
      'no-delete-var': 1,
      'no-undef-init': 2,
      'no-unused-vars': 1,
      'no-use-before-define': 2,
    },
  })).pipe(eslint.format()).pipe(eslint.failAfterError());
});

gulp.task('clean', function () {
  return del('bin');
});
