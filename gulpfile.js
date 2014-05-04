var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    path = require('path'),
    connect = require('connect'),
    webpack = require('webpack'),
    config = require('./config');

gulp.task('clean', function() {
  return gulp.src(path.join(__dirname, 'dist'), {
      read: false
    }).pipe(clean());
});

gulp.task('webpack', function (callback) {
  webpack(config.webpack, function(err, stats) {
    if (err) {
      throw new gutil.PluginError("execWebpack", err);
    }
    return gutil.log("[execWebpack]", stats.toString({
      colors: true
    }));
  });

  return callback();
});

gulp.task('copy', function() {
  return gulp.src([
      './src/**/*',
      '!./src/scripts',
      '!./src/scripts/**/*'])
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('build', ['webpack', 'copy'], function() {
  return gutil.log('building...');
});

gulp.task('dev', ['build'], function () {

  gulp.watch([path.join(__dirname, 'src/**/*')], function () {
    gulp.run('build');
  });

  var server = connect.createServer(
    connect.static(config.webpack.output.path)
  );

  gutil.log('[server] started on port: 8888');
  server.listen(8888);
});

gulp.task('server', ['build'], function () {

  gulp.watch([path.join(__dirname, 'src/**/*')], function () {
    gulp.run('build');
  });

  var server = connect.createServer(
    connect.static(config.webpack.output.path)
  );
  server.listen(80);
});

gulp.task('default', ['dev'], function () {});
gulp.task('prod', ['server'], function () {});
