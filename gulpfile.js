'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'del']});
var runSequence = require('run-sequence');

var config = {
    src: 'src',
    dist: {
        folder: 'dist',
        minFilePrefix: 'core-enderecos.min',//JS, CSS vão nas tasks
        filePrefix: 'core-enderecos'
    }
};

function plumbedSrc() {
    return gulp.src
        .apply(gulp, arguments)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }));
}

function getJsHtmlStream() {
    return $.merge(
        plumbedSrc([config.src + '/**/*.html'])
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe($.angularTemplatecache({module: 'endereco'}))

        ,
        plumbedSrc([config.src + '/**/*.js'])
            .pipe($.jshint())
            .pipe($.jshint.reporter('default'))
        )
        .pipe($.angularFilesort());
}
gulp.task('js:min', function () {
    return getJsHtmlStream()

        .pipe($.uglify())
        .pipe($.concat(config.dist.minFilePrefix + '.js'))

        .pipe(gulp.dest(config.dist.folder));
});

gulp.task('js', function () {
    return getJsHtmlStream()

        .pipe($.concat(config.dist.filePrefix + '.js'))

        .pipe(gulp.dest(config.dist.folder));
});

gulp.task('clean', function () {
    $.del.sync([config.dist.folder]);
});

gulp.task('build', ['clean'], function (done) {
    runSequence(['js', 'js:min'], done);
});

gulp.task('watch', ['build'], function (done) {
    gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['build']);