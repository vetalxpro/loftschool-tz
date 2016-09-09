var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug');

gulp.task('sass', function () {
  return gulp.src('./source/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./source/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./source/scss/**/*.scss', ['sass']);
});

gulp.task('jade', function () {
  return gulp.src('./source/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./source/'));
});

gulp.task('jade:watch', function () {
  gulp.watch('./source/**/*.pug', ['jade']);
});


gulp.task('default', function () {

});

