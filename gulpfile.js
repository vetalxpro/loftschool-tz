"use strict";

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug');

gulp.task('sass', function () {
  return gulp.src('./app/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./app/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./app/scss/**/*.scss', ['sass']);
});


gulp.task('jade', function () {
  return gulp.src('./app/jade/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./app/'));
});

gulp.task('jade:watch', function () {
  gulp.watch('./app/jade/**/*.pug', ['jade']);
});



gulp.task('default', function () {

});

