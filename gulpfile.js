"use strict";

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    // uncss = require('gulp-uncss'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    wiredep = require('wiredep').stream;

//----------------- SASS -------------------------
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
      .pipe(gulp.dest('./app/css'))
      .pipe(browserSync.stream({match: '**/*.css'}));           //reload page with browsersync
});


//-------------------------jade(+wiredep)-------------------------

gulp.task('jade', function () {
  gulp.src('./app/jade/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./app'))
      .pipe(wiredep({
        direcory: './app/bower_components'
      }))
      .pipe(gulp.dest('./app'))
      .pipe(browserSync.stream());

});


//-------------------------uncss-------------------------
// gulp.task('uncss', function () {
//   return gulp.src('site.css')
//       .pipe(uncss({
//         html: ['index.html', 'posts/**/*.html', 'http://example.com']
//       }))
//       .pipe(gulp.dest('./out'));
// });


//-------------------------useref (сборка в dist)-------------------------

gulp.task('dist', function () {
  return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(gulp.dest('dist'));
});

//---------------------------BROWSER-SYNC----------------------

function hello(){
  console.log('Ready for work ;)');
}

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
    // proxy: "localhost:8888"
    // files: ["app/*.html", "app/css/*.css", "app/js/*.js"]
    port: 8769,
    // logConnections: true,
    open: 'local',
    notify: true
  },hello);
  gulp.watch('./app/scss/**/*.scss', ['sass']);
  gulp.watch('./app/jade/**/*.pug', ['jade']);
  // browserSync.watch("*.html").on("change", browserSync.reload);


});

gulp.task('default', ['sass', 'jade', 'serve']);

