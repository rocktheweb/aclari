var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence');
var replace = require('gulp-replace');
var autoprefixer = require('autoprefixer');


// Configuration file
var cfg = require('./gulpconfig.json');
var paths = cfg.paths;

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function() {
	var stream = gulp
		.src(paths.sass + '/*.scss')
		.pipe(
			plumber({
				errorHandler: function(err) {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass({ errLogToConsole: true }))
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write(undefined, { sourceRoot: null }))
		.pipe(gulp.dest(paths.css));
	return stream;
});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function() {
	gulp.watch(`${paths.sass}/**/*.scss`, gulp.series('styles'));
	gulp.watch(`${paths.imgsrc}/**`, gulp.series('imagemin-watch'));
});


// Run:
// gulp imagemin
// Running image optimizing task
gulp.task('imagemin', function() {
	gulp
		.src(`${paths.imgsrc}/**`)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.img));
});

/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 * @verbose
 */
gulp.task(
	'imagemin-watch',
	gulp.series('imagemin', function() {
		browserSync.reload();
	})
);

gulp.task('minifycss', function() {
	return gulp
		.src(`${paths.css}/main.css`)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(cleanCSS({ compatibility: '*' }))
		.pipe(
			plumber({
				errorHandler: function(err) {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});


gulp.task('styles', function(callback) {
	gulp.series('sass', 'minifycss')(callback);
});


// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
	browserSync.init({
        files: ["./css/*.min.css", "./js/*.min.js", "./**/*.html"],
        server: {
            baseDir: "./"
        }   
    });
});

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('watch-bs', gulp.parallel('browser-sync', 'watch'));

// Run:
// gulp
// Starts watcher (default task)
gulp.task('default', gulp.series('watch'));