var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("src/js/contents.js")
    .pipe(babel())
    .pipe(gulp.dest("src/js/dist"));
});