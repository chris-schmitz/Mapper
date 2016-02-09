var gulp = require('gulp');
var vueify = require('vueify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');

gulp.task('default', ['watch', 'serve']);

gulp.task('serve', function (){
    connect.server({
        root: ['public'],
        port:8081
    });
});

gulp.task('build-app', function (){
    return browserify('src/app/app.js')
        .transform(vueify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function (){
    gulp.watch('src/**/*.js', ['build']);
})
