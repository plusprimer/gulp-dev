const gulp = require('gulp');
const browserSync = require('browser-sync');
const mock = require('./mock/mock.js');

gulp.task('mock', function(){
  let files = [
    '**/*.html',
    './img/*',
    './css/*.css',
    './js/*.js'
  ];
  browserSync.init(files, {
    server: {
      baseDir: 'data/',
      middleware: mock.data()
    },
    port: 8090,
    startPath: '/'
  });  
});
