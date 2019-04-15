const gulp = require('gulp');
const watch = require('gulp-watch');
const del = require('del');
const gutil = require('gulp-util');

const combiner = require('stream-combiner2');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const globby = require('globby');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');

const Fiber = require('fibers');
const sass = require('gulp-sass');
sass.complier = require('sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssBase64 = require('gulp-css-base64');
const flexibility = require('postcss-flexibility');

const i18n = require('gulp-i18n-localize');

const babelify = require('babelify');

const tsify = require('tsify');

const browserify = require('browserify');
const uglify = require('gulp-uglify');

const bs = require('browser-sync').create();
const reload = bs.reload;

// 路径字典
const pathmap = {
  src: {
    css: "./src/css",
    js: "./src/js",
    locale: "./src/locales",
    images: ["./src/images/**/*.{JPG,jpg,png,gif,svg}"],
    fonts: "./src/fonts/**/*",
    plugins: "./src/plugins/**/*",
    jspath: "./src/js/**/*.js",
    ts: ["./src/ts/**/*.ts", "!./src/ts/**/_*.ts"],
    scripts: ["./src/scripts/**/*.js", "!./src/scripts/**/_*.js"],
    html: ["./src/**/*.html", "!./src/**/*-*.html"],
    cssFile: "./src/css/**/*.css",
    scss: ["./src/scss/**/*.scss", "!./src/scss/**/_*.scss"]
  },
  dist: {
    dir: "./dist",
    images: "./dist/images",
    fonts: "./dist/fonts",
    plugins: "./dist/plugins",
    js: "./dist/js",
    css: "./dist/css"
  }
};

// 是否开启国际化
let isI18n = false;

// browser-sync服务器
gulp.task('dev', function () {
  bs.init({
    startPath: './',
    server: {
      baseDir: "./src"
    },    
    reloadDelay: 10,
    port: 8080
  });

  if(isI18n) {
    watch(pathmap.src.html, gulp.series('i18n')).on('change', reload);
  } else {
    watch(pathmap.src.html).on('change', reload);
  }
  watch('./src/scss/**/*.scss', gulp.series('scss'));
  watch('./src/ts/**/*.ts', gulp.series('typescript'));
  watch('./src/scripts/**/*.js', gulp.series('babel-es'));
})

// html国际化 
gulp.task('i18n', function(){
  return gulp.src(pathmap.src.html)
    .pipe(i18n({
      locales: ['en-US', 'zh-CN'],
      localeDir: pathmap.src.locale,
      schema: 'suffix'
    }))
    .pipe(gulp.dest('src/'))
})

// 编译scss
gulp.task('scss', function() {
  const plugins = [
    autoprefixer({
      browsers: ['last 10 version']
    }),
    flexibility()
  ];
  return gulp.src(pathmap.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        fiber: Fiber,
        includePaths: [
          'node_modules/family.scss/source/src',
          'node_modules/slick-carousel/slick/',
          'node_modules/normalize-scss/sass/'
        ]
      }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(cssBase64({
      baseDir: '../images',     // 相对于css文件和图片的路径
      maxWeightResource: 32768,  // 单位字节，32768字节，32k大小
      extensionsAllowed: ['.gif', '.jpg', '.jepg', '.png']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(pathmap.src.css))
    .pipe(reload({
      stream: true
    }));
})

gulp.task('babel-es', function () {
  return globby(pathmap.src.scripts).then(function(entries){
    entries.forEach(function(file){
      let filename = file.substr(file.lastIndexOf('/')+1);

      combiner.obj([
        browserify({
          entries: file,
          debug: true
        }).transform(babelify, {
          presets: ['env']
          // presets: ['@babel/preset-env']
        })
        .bundle(),
        source(filename),
        buffer(),
        sourcemaps.init({
          loadMaps: true
        }),
        // uglify(),
        rename({
          // suffix: '.min'   // a.js -> a.min.js
          suffix: ''
        }),
        sourcemaps.write('.'),
        gulp.dest(pathmap.src.js),
        reload({
          stream: true
        })
      ]).on('error', console.error.bind(console));
    })
  });
});


// typescript -> es3
gulp.task('typescript', function() {
  return globby(pathmap.src.ts).then(function (entries) {
    entries.forEach(function (file) {
      let filename = file.substr(file.lastIndexOf('/') + 1).split('.')[0] + ".js";
      browserify({
        basedir: '.',
        entries: file,
        debug: true,
        packageCache: {}
      })
        .plugin(tsify, {})
        .bundle()
        .on('error', gutil.log)
        .pipe(source(filename))
        .pipe(buffer())
        .pipe(sourcemaps.init({
          loadMaps: true
        }))
        .pipe(uglify())
        .pipe(rename({
          // suffix: '.min' // a.js -> a.min.js
          suffix: ''
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathmap.src.js))
        .pipe(reload({
          stream: true
        }))
    });
  }).catch(function (err) {
    console.log(err);
  });
});


// 复制样式
function copyCss() {
  return gulp.src(pathmap.src.cssFile).pipe(postcss([cssnano()])).pipe(gulp.dest(pathmap.dist.css));
}

// 复制图片
function copyImages() {
  return gulp.src(pathmap.src.images).pipe(gulp.dest(pathmap.dist.images));
}

// 复制字体库
function copyFont() {
  return gulp.src(pathmap.src.fonts).pipe(gulp.dest(pathmap.dist.fonts));
}
// 复制插件
function copyPlugins() {
  return gulp.src(pathmap.src.plugins).pipe(gulp.dest(pathmap.dist.plugins));
}
// 复制js
function copyJs() {
  return gulp.src(pathmap.src.jspath).pipe(uglify()).pipe(gulp.dest(pathmap.dist.js));
}

// 复制html
function copyHtml() {
  return gulp.src(pathmap.src.html).pipe(gulp.dest(pathmap.dist.dir));
}

// 清空目录文件，防止出现异常
function clearPath(cb) {
  del.sync([pathmap.dist.dir]);
  cb();
}

// 打包
gulp.task('dist',
  gulp.series(clearPath,
    gulp.parallel(
      copyFont,
      copyHtml,
      copyImages,
      copyJs,
      copyPlugins,
      copyCss
    )
  )
);

