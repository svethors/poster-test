
const gulp = require("gulp");
const babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");

gulp.task("default", function() {
    return gulp.src("./js/es6/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["env"],
            plugins: ['transform-runtime']
        }))
        .pipe(concat("./js/all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./wwwroot/js/"));
});
