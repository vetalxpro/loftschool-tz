"use strict";

var gulp = require('gulp'),
    browserSyncTmp = require('browser-sync').create(),
    browserSyncDist = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    size = require('gulp-size'),
    newer = require('gulp-newer'),
    //cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    // postcss    = require('gulp-postcss'),
    pug = require('gulp-pug'),
    // uncss = require('gulp-uncss'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    del = require('del'),
    wiredep = require('wiredep').stream,
    sftp = require('gulp-sftp');


//------------------------PATHS----------------------------------
var bases = {
  app: 'app/',
  dist: 'dist/',
  tmp: '.tmp/'
};

var paths = {
  scripts: ['js/**/*.js'],
  styles: {css: 'css/**/*.css'},
  html: ['index.html'],
  images: ['res/img/**/*.{jpg,png,gif}'],
  fonts: ['res/fonts/**/*'],
  icons: ['res/icons/**/*']
};

//----------------- SASS -------------------------

gulp.task('sass', function () {
  return gulp.src(bases.app + 'src/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 4 versions']
      }))
      .pipe(size({title: 'sass'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(bases.app + '.tmp/css/'))
      .pipe(browserSyncTmp.stream({match: '**/*.css'}));           //reload page with browsersync
});


//-------------------------JADE(+wiredep)-------------------------

gulp.task('jade', function () {
  return gulp.src(bases.app + 'src/jade/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(bases.app + '.tmp/'))
      .pipe(wiredep({
        direcory: bases.app + '.tmp/bower_components/'
      }))
      .pipe(size({title: 'jade'}))
      .pipe(gulp.dest(bases.app + '.tmp/'))
      .pipe(browserSyncTmp.stream());  //reload page

});

//-------------------------JS-------------------------

gulp.task('scripts', function () {
  return gulp.src(bases.app + 'src/js/**/*.js')
      .pipe(gulp.dest(bases.app + '.tmp/js'))
      .pipe(size({title: 'scripts'}))
      .pipe(browserSyncTmp.stream());        //reload page
});

//--------------------copy-res-------------------------

gulp.task('copy:res', function (cb) {
  gulp.src(bases.app + 'res/fonts/**/*')
      .pipe(newer(bases.app + '.tmp/fonts'))
      .pipe(size({title: 'fonts'}))
      .pipe(gulp.dest(bases.app + '.tmp/fonts'))
      .pipe(browserSyncTmp.stream());   //reload page

  gulp.src(bases.app + 'res/img/**/*')
      .pipe(newer(bases.app + '.tmp/img'))
      .pipe(size({title: 'img'}))
      .pipe(gulp.dest(bases.app + '.tmp/img'))
      .pipe(browserSyncTmp.stream());   //reload page

  gulp.src(bases.app + 'res/icons/**/*')
      .pipe(newer(bases.app + '.tmp/icons'))
      .pipe(size({title: 'icons'}))
      .pipe(gulp.dest(bases.app + '.tmp/icons'))
      .pipe(browserSyncTmp.stream());   //reload page
  cb();
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

gulp.task('serve:tmp', function (cb) {
  browserSyncTmp.init({
    server: {
      baseDir: bases.app + '.tmp',
      routes: {
        "/bower_components": "app/bower_components"
      }
    },
    // proxy: "localhost:8888"
    // files: ["app/*.html", "app/css/*.css", "app/js/*.js"]
    port: 8769,
    // logConnections: true,
    ui: {
      port: 8770
    },
    open: 'local',
    notify: true
  }, hello);
  gulp.watch(bases.app + 'res/**/*', ['copy:res']);
  gulp.watch(bases.app + 'src/scss/**/*.scss', ['sass']);
  gulp.watch(bases.app + 'src/jade/**/*.pug', ['jade']);
  gulp.watch(bases.app + 'src/js/**/*.js', ['scripts']);
  // browserSync.watch(bases.app + "*.html").on("change", browserSync.reload);
  cb();


});

gulp.task('serve:dist', function (cb) {
  browserSyncDist.init({
    server: {
      baseDir: bases.dist
    },
    // proxy: "localhost:8888"
    port: 8779,
    ui: {
      port: 8780
    },
    // logConnections: true,
    open: 'local',
    notify: true
  });
  cb();
});


//============================== BUILD and DEPLOY =====================================

// Delete the dist directory
gulp.task('clean', function () {
  return del.sync(bases.dist);
});

// Optimize images
/*gulp.task('images', function () {
 gulp.src('app/images/!**!/!*')
 .pipe($.cache($.imagemin({
 progressive: true,
 interlaced: true
 })))
 .pipe(gulp.dest('dist/images'))
 .pipe($.size({title: 'images'}));
 });*/


gulp.task('build : dist', ['clean'], function () {

  gulp.src(paths.images, {cwd: bases.app})
      .pipe(size({
        title: 'images'
      }))
      .pipe(gulp.dest(bases.dist + 'img/'));

  gulp.src(paths.fonts, {cwd: bases.app})
      .pipe(size({
        title: 'fonts'
      }))
      .pipe(gulp.dest(bases.dist + 'fonts/'));

  gulp.src(paths.icons, {cwd: bases.app})
      .pipe(size({
        title: 'icons'
      }))
      .pipe(gulp.dest(bases.dist + 'icons/'));

  return gulp.src(bases.app + '.tmp/index.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(size({
        showFiles: true,
        title: 'main files'
      }))
      .pipe(gulp.dest(bases.dist));
});

gulp.task('sftp', function () {
  return gulp.src(bases.dist + '**/*')
      .pipe(sftp({
        host: '',
        user: '',
        pass: ''
      }));
});

//==================================================================


gulp.task('default', function () {
  runSequence(['sass', 'jade', 'scripts', 'copy:res'], 'serve:tmp');
});
