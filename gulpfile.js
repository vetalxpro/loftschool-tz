"use strict";

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    // uncss = require('gulp-uncss'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    del = require('del'),
    wiredep = require('wiredep').stream;


//------------------------PATHS----------------------------------
var bases = {
  app: 'app/',
  dist: 'dist/',
};

var paths = {
  scripts: ['js/**/*.js'],
  styles: ['css/**/*.css'],
  html: ['index.html'],
  images: ['resource/img/**/*.png', 'resource/img/**/*.jpg'],
  fonts: ['resource/fonts/**/*'],
  icons: ['resource/icons/**/*']
};

//----------------- SASS -------------------------

gulp.task('sass', function () {
  return gulp.src(bases.app + 'scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(bases.app + 'css/'))
      .pipe(browserSync.stream({match: '**/*.css'}));           //reload page with browsersync
});


//-------------------------jade(+wiredep)-------------------------

gulp.task('jade', function () {
  return gulp.src(bases.app + 'jade/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(bases.app))
      .pipe(wiredep({
        direcory: bases.app + 'bower_components/'
      }))
      .pipe(gulp.dest(bases.app))
      .pipe(browserSync.stream());  //reload page

});


//-------------------------uncss-------------------------
// gulp.task('uncss', function () {
//   return gulp.src('site.css')
//       .pipe(uncss({
//         html: ['index.html', 'posts/**/*.html', 'http://example.com']
//       }))
//       .pipe(gulp.dest('./out'));
// });


//---------------------------BROWSER-SYNC----------------------

function hello() {
  console.log('Ready for work ;)');
}

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: bases.app
    },
    // proxy: "localhost:8888"
    // files: ["app/*.html", "app/css/*.css", "app/js/*.js"]
    port: 8769,
    // logConnections: true,
    open: 'local',
    notify: true
  }, hello);
  gulp.watch(bases.app + 'scss/**/*.scss', ['sass']);
  gulp.watch(bases.app + 'jade/**/*.pug', ['jade']);
  // browserSync.watch("*.html").on("change", browserSync.reload);


});


//============================== DEPLOY =====================================

//useref (сборка в dist)
gulp.task('dist', function () {
  return gulp.src(bases.app + '*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(gulp.dest(bases.dist));
});

// Delete the dist directory
gulp.task('clean', function () {
  return del.sync(bases.dist);
});

// Imagemin images and ouput them in dist
gulp.task('copyImg', function () {
  gulp.src(paths.images, {cwd: bases.app})
  // .pipe(imagemin())
      .pipe(gulp.dest(bases.dist + 'resource/img/'));
});

gulp.task('copyFonts', function () {
  gulp.src(paths.fonts, {cwd: bases.app})
      .pipe(gulp.dest(bases.dist + 'resource/fonts/'));
});

gulp.task('copyIcons', function () {
  gulp.src(paths.icons, {cwd: bases.app})
      .pipe(gulp.dest(bases.dist + 'resource/icons/'));
});

gulp.task('deploy', ['clean', 'copyImg', 'copyFonts', 'copyIcons', 'dist']);

//==================================================================


gulp.task('default', function () {
  runSequence(['sass','jade'], 'serve');
});
