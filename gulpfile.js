var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    image = require('gulp-image'),
    spritesmith = require('gulp.spritesmith'),
    cache = require('gulp-cache'),
    del = require('del');

/* Copying HTML */
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('www'))
    .pipe(livereload());
})

/* Making sprite */
gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/sprite/*.*').pipe(spritesmith({
    padding: 2,
    imgName: 'sprite.png',
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

/* Compiling SASS */
gulp.task('sass', function () {
 return gulp.src('src/css/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('www/css'))
  .pipe(livereload());
});


gulp.task('sass:watch', function () {
  livereload.listen();
  gulp.watch('src/index.html', gulp.series('html'));
  return gulp.watch('src/css/*.scss', gulp.series('sass'));
});

/* Cleaning */
gulp.task('clean', function() {
  return del('www');
})


gulp.task(
  'default',
  gulp.series('clean', 'html', 'sprite', 'image', 'sass', 'sass:watch')
);
