var gulp = require('gulp');

var $ = require('gulp-load-plugins')({pattern: ['gulp-*']});

var config = {
    src: 'src',
    dist: 'dist',
    module: 'core.enderecos'
};

gulp.task('dist', function () {
    return $.merge(gulp.src([config.src + '/**/*.html']).pipe($.angularTemplatecache({module: config.module})),
        gulp.src([config.src + '/**/*.js', '!' + config.src + '/**/*.spec.js']))
        .pipe($.angularFilesort())
        .pipe($.concat(config.module + '.js'))
        .pipe(gulp.dest(config.dist))
});

gulp.task('dist:min', function () {
    return $.merge(gulp.src([config.src + '/**/*.html']).pipe($.angularTemplatecache({module: config.module})),
        gulp.src([config.src + '/**/*.js', '!' + config.src + '/**/*.spec.js']))
        .pipe($.angularFilesort())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.concat(config.module + '.min.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.dist))
});

gulp.task('default', ['dist', 'dist:min']);