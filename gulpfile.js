var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./source/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./source/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./source/scss/**/*.scss', ['sass']);
});



gulp.task('default',function(){

});

