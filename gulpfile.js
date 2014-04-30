var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var embedlr = require('gulp-embedlr');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon').includePaths;
var debug = require('gulp-debug');

var dest = 'build';

gulp.task('static', function (next) {
  var staticS = require('node-static'),
      server = new staticS.Server('./' + dest),
      port = 8001;

  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      server.serve(request, response);
    }).resume();
  }).listen(port, function () {
    gutil.log('Server listening on port: ' + gutil.colors.magenta(port));
    next();
  });
});

gulp.task('watch', ['static'], function () {
  var server = livereload();
  gulp.watch(dest + '/**').on('change', function (file) {
    gutil.log('Changed ' + file.path);
    server.changed(file.path);
  });

  watch({ glob: './js/*.js' })
    .pipe(gulp.dest(dest + '/js'));

  watch({ glob: ['./scss/*.scss'] }, function (files) {
    gulp.src('./scss/*.scss')
      .pipe(debug({verbose:false}))
      .pipe(sass({ errLogToConsole: true, includePaths: bourbon }))
      .pipe(gulp.dest(dest + '/css'));
  });

  gulp.src('./src/index.html')
    .pipe(watch())
    .pipe(embedlr())
    .pipe(gulp.dest(dest));
});
