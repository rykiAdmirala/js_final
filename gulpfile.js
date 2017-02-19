var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    image = require('gulp-image'),
    spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprite/*.*').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss'
  }));
  
  spriteData.img.pipe(gulp.dest('src/img/'));
  var stream = spriteData.css.pipe(gulp.dest('src/css/'));
  return stream;
});

gulp.task('image', function () {
  var stream = gulp.src('src/img/*.*')
    .pipe(image())
    .pipe(gulp.dest('build/img/'));
  return stream;
});

gulp.task('sass', function () {
 return gulp.src('src/css/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'))
  .pipe(livereload());
});

gulp.task('sass:watch', function () {
  livereload.listen();
  return gulp.watch('src/css/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sprite', 'image', 'sass', 'sass:watch'));
