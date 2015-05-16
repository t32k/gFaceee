var gulp = require("gulp");

gulp.task('watch', function () {
  gulp.watch('src/js/*.js', function () {
    gulp.start('js');
  });
});

gulp.task('build', function () {
  gulp.start('js', 'css', 'copy');
});

gulp.task('js', function () {

  var browserify = require('browserify');
  var babelify = require('babelify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var uglify = require('gulp-uglify');

  return browserify({
    entries: ['src/js/contents.js'],
    extensions: ['.js']
  }).transform(babelify)
    .bundle()
    .pipe(source('contents.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"));
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