var gulp = require("gulp");

gulp.task('watch', function () {
  gulp.watch('src/js/contents.js', function () {
    gulp.start('js:app');
  });
});

gulp.task('build', function () {
  gulp.start('js:app', 'js:lib', 'css', 'copy');
});

gulp.task('js:app', function () {

  var babel = require('gulp-babel');
  var uglify = require('gulp-uglify');

  return gulp.src('src/js/contents.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"));
});

gulp.task("js:lib", function () {

  var uglify = require('gulp-uglify');

  return gulp.src('src/js/lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/lib'));
});

gulp.task('css', function () {

  var csso = require('gulp-csso');

  return gulp.src('src/css/*.css')
    .pipe(csso())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function () {
  
  gulp.src('src/manifest.json').pipe(gulp.dest('dist/'));
  gulp.src('src/img/*.png').pipe(gulp.dest('dist/img'));
  
});