'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var concat = require('gulp-concat');
sass.compiler = require('node-sass');
gulp.task('sass', function () {
  return gulp.src('./web/themes/custom/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./web/themes/custom/'));
});
