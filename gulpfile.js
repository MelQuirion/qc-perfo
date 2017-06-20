var gulp    = require('gulp')
,   sass    = require('gulp-sass')
,   concat  = require('gulp-concat')
,   babel   = require('gulp-babel')
,   server  = require('gulp-server-livereload')
,   uglify  = require('gulp-uglify')
,   rename  = require("gulp-rename")
,   clean   = require('gulp-clean')
,   plumber = require('gulp-plumber');

var dkitJsWatch  = ['lib/javascript/devkit/**/*.js', '!lib/javascript/devkit/devkit.js']
,   dkitJsConcat = ['lib/javascript/devkit/_config/*.js', 'lib/javascript/devkit/_modules/*.js']
,   scssWatch    = ['lib/scss/**/*.scss', '!lib/scss/_patch/*.scss']
,   es2015Watch  = ['lib/javascript/**/*.js', '!lib/javascript/devkit/**/*.js'];


// ------ WATCH TASK (GULP DEVKIT) ------- \\

	gulp.task('devkit', function(){
		gulp.watch(scssWatch, ['sass', 'rename-css']);  
		gulp.watch(dkitJsWatch, ['concat-js', 'compress', 'rename-js', 'clean-js']); 
		gulp.watch(es2015Watch, ['es2015']);

		gulp.src('./')
		.pipe(server({
		  livereload: true,
		  directoryListing: true,
		  open: true
		}));
	});


// ------ SASS PRODUCTION PRE-PROCESSORS ------- \\

	gulp.task('sass', function(){
	  return gulp.src('lib/scss/styles.scss')
	  	.pipe(plumber())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('styles'))
	});

	gulp.task('rename-css',['sass'], function(){
		return gulp.src("styles/styles.css")
			.pipe(rename("styles.min.css"))
			.pipe(gulp.dest("styles"));
	});


// ------ DEVKIT PRODUCTION ENVIRONEMENT ------- \\

	gulp.task('concat-js', function() {
		return gulp.src(dkitJsConcat)
			.pipe(plumber())
			.pipe(concat('devkit.js'))
			.pipe(gulp.dest('lib/javascript/devkit'));
	});

	gulp.task('compress',['concat-js'], function () {
		return gulp.src('lib/javascript/devkit/devkit.js')
			.pipe(plumber())
			.pipe(uglify())
			.pipe(gulp.dest('scripts'))
	});

	gulp.task('rename-js', ['concat-js', 'compress'], function(){
		return gulp.src("scripts/devkit.js")
			.pipe(rename("devkit.min.js"))
			.pipe(gulp.dest("scripts"));
	});

	gulp.task('clean-js', ['concat-js','compress','rename-js'], function () {
		return gulp.src(['scripts/devkit.js'], {read: false})
			.pipe(clean());
	});


// ------ JS/ES2015 PRODUCTION PRE-PROCESSORS ------- \\

	gulp.task('es2015', () => {
		return gulp.src(['lib/javascript/**/*.js', '!lib/javascript/devkit/**/*.js'])
			.pipe(plumber())
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(concat('library.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('scripts'));
	});
