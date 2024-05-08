'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const sourceMaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');
gulp.task('sass', function () {
  return gulp.src('./web/themes/custom/**/*.scss')
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./web/themes/custom/'));
});
