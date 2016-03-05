var gulp = require('gulp');
var vueify = require('vueify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var gutil = require('gutil');
var notify = require('gulp-notify');

gulp.task('default', ['watch', 'serve']);

gulp.task('serve', function (){
    connect.server({
        root: ['public'],
        port:8081
    });
});

gulp.task('testerror', function (){
    console.log('fired');
    notify('test');

});

function handleErrors(error){
    console.log(error);
    notify('test');
    // notify.onError({
    //     title: 'Compilation error',
    //     message: 'There was an error.'
    // });
    this.emit('end');
}

gulp.task('build-app', function (){
    return browserify('src/app/app.js')
        .transform(vueify)
        .on('error', handleErrors)
        .bundle()
        .on('error', handleErrors)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function (){
    gulp.watch('src/**/*.{js,vue,scss}', ['build-app']);
});
