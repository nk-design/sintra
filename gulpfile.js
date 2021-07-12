const { src, dest } = require("gulp");
const sass = require('gulp-sass')(require('node-sass'));
const eslint = require("gulp-eslint");
const { watch, parallel } = require("gulp");
const sync = require("browser-sync").create();

function copy(cb) {
    src('routes/*.js')
        .pipe(dest('copies'));
    cb();
}

exports.copy = copy;

function generateCSS(cb) {
    src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/stylesheets'))
        .pipe(sync.stream());
    cb();
}

exports.css = generateCSS;

function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}

exports.lint = runLinter;

function watchFiles(cb) {
    watch('sass/**.scss', generateCSS);
    watch([ '**/*.js', '!node_modules/**'], parallel(runLinter));
}

exports.watch = watchFiles;

function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./public"
        }
    });
    watch('sass/**.scss', generateCSS);
    watch("./public/**.html").on('change', sync.reload);
}

exports.sync = browserSync;