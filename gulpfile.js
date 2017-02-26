var gulp = require('gulp'),
    pump = require('pump');
    uglifyjs = require('gulp-uglify');
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css');
    autoprefixer = require('gulp-autoprefixer');
    livereload = require('gulp-livereload'),
    image = require('gulp-image'),
    spritesmith = require('gulp.spritesmith'),
    cache = require('gulp-cache'),
    del = require('del');


/* Uglifying JS */
gulp.task('scripts', function(cb) {
  return pump([
      gulp.src('src/js/*.js'),
      uglifyjs(),
      gulp.dest('www/js/'),
      livereload()
    ],
    cb
  );
});

/* Compiling and prefixing Styles */
gulp.task('styles', function (cb) {
  return pump([
      gulp.src('src/css/*.scss'),
      sourcemaps.init(),
      sass().on('error', sass.logError),
      autoprefixer({
            browsers: ['>0.01%'],
            cascade: false
      }),
      // cleanCSS({compatibility: 'ie8'}),
      sourcemaps.write(),
      gulp.dest('www/css'),
      livereload()
    ],
    cb
  );
});

/* Watching for styles and html changes */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('src/js/*.js', gulp.series('scripts'));
  gulp.watch('src/index.html', gulp.series('html'));
  return gulp.watch('src/css/*.scss', gulp.series('styles'));
});

/* Making sprite */
gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
    padding: 2,
    retinaSrcFilter: ['src/img/sprite/*@2x.png'],
    imgName: 'sprite.png',
    retinaImgName: 'sprite@2x.png',
    cssName: '_sprite.scss'
  }));
  
  spriteData.img.pipe(gulp.dest('src/img/'));
  return spriteData.css.pipe(gulp.dest('src/css/'));
});

/* Optimizing images */
gulp.task('image', function () {
  return gulp.src('src/img/*.*')
    .pipe(cache(image()))
    .pipe(gulp.dest('www/img/'));
});

/* Copying HTML */
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('www'))
    .pipe(livereload());
});



/* Cleaning */
gulp.task('clean', function() {
  return del('www');
})


gulp.task(
  'default',
  gulp.series('clean', 'html', 'sprite', 'image', 'scripts', 'styles', 'watch')
);
