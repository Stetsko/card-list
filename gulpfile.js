var gulp           = require('gulp'),
		plugins        = require('gulp-load-plugins')(),
		bowerFiles     = require('main-bower-files'),
		browserSync    = require('browser-sync'),
		es             = require('event-stream'),
		del            = require('del');

/* = = =
 |
 | PATH
 |
 = = = */

var paths = {
	scripts:		'app/**/*js',
	styles:			'app/scss/**/*.scss',
	images:			'app/img/**/*',
	index:			'app/index.html',
	partialas:	['app/**/*.html', '!app/index.html'],
	distDev:		'dist.dev',
	distProd:		'dist.prod',
	distDevCss: 'dist.dev/css'
}

/* = = =
 |
 | PIPE SEGMENT
 |
 = = = */

var pipes = {}

pipes.orderedVendorScripts = function() {
	return plugins.order(['jquery.js', 'angular.js'])
};

pipes.buildVendorScriptsDev = function() {
	return gulp.src(bowerFiles())
				.pipe(gulp.dest(paths.distDev + '/bower_components'));
};

pipes.buildAppScriptsDev = function() {
	return gulp.src(paths.scripts)
	.pipe(plugins.concat('app.js'))
	.pipe(gulp.dest(paths.distDev));
};

pipes.buildStylesDev = function() {
	return gulp.src(paths.styles)
				.pipe(plugins.sass())
				.pipe(plugins.autoprefixer(['last 15 versions']))
				.pipe(gulp.dest(paths.distDev + '/css'));
};

pipes.buildIndexDev = function() {

	var orderedVendorScripts = pipes.buildVendorScriptsDev()
		.pipe(pipes.orderedVendorScripts());

	var orderedAppScripts = pipes.buildAppScriptsDev();

	var appStyles = pipes.buildStylesDev();
		
		return gulp.src(paths.index)
			.pipe(gulp.dest(paths.distDev))
			.pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
			.pipe(plugins.inject(orderedAppScripts, {relative: true}))
			.pipe(plugins.inject(appStyles, {relative: true}))
			.pipe(gulp.dest(paths.distDev));
};

pipes.buildPartialsFilesDev = function() {
	return gulp.src(paths.partialas)
		.pipe(gulp.dest(paths.distDev));
};

pipes.processedImagesDev = function() {
		return gulp.src(paths.images)
			.pipe(gulp.dest(paths.distDev + '/img'));
};

pipes.buildAppDev = function() {
  return es.merge(pipes.buildIndexDev(), pipes.buildPartialsFilesDev(), pipes.processedImagesDev());
};



/* = = =
 |
 | TASK
 |
 = = = */

gulp.task('clean-dev', function() {
	return del(paths.distDev);
});

gulp.task('build-app-scripts-dev', pipes.buildAppScriptsDev);

gulp.task('bild-index-dev', pipes.buildIndexDev);

gulp.task('build-partials', pipes.buildPartialsFilesDev);

gulp.task('build-app-dev', pipes.buildAppDev);

gulp.task('build-styles-dev', pipes.buildStylesDev);

gulp.task('clean-build-app-dev', ['clean-dev'], pipes.buildAppDev);

gulp.task('watch-dev', ['clean-build-app-dev'], function() {

	var reload = browserSync.reload;

	browserSync({
		port: 8000,
		server:{
			baseDir: paths.distDev
		}
	});

gulp.watch(paths.index, function() {
	return pipes.buildIndexDev()
		.pipe(reload({stream: true}));
});

gulp.watch(paths.styles, function() {
	return pipes.buildStylesDev()
		.pipe(reload({stream: true}));
});

gulp.watch(paths.scripts, function() {
	return pipes.buildAppScriptsDev()
		.pipe(reload({stream: true}));
});

gulp.watch(paths.partialas, function() {
	return pipes.buildPartialsFilesDev()
		.pipe(reload({stream: true}));
});

gulp.watch(paths.images, function() {
	return pipes.processedImagesDev()
		.pipe(reload({stream: true}));
});
});

/* = = =
 | PROD TASKS
 = = = */

 pipes.buildPartialsFilesProd = function() {
	return gulp.src(paths.partialas)
		.pipe(gulp.dest(paths.distProd));
};


pipes.processedImagesProd = function() {
		return gulp.src(paths.images)
			.pipe(gulp.dest(paths.distProd + '/img'));
}

pipes.buildAppScriptsProd = function() {
  return gulp.src(paths.distDev + '/app.js')
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.distProd));
};

pipes.buildVendorScriptsProd = function() {
  return gulp.src(bowerFiles('**/*.js'))
      .pipe(pipes.orderedVendorScripts())
      .pipe(plugins.concat('vendor.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.distProd + '/js'));
};

pipes.buildStylesProd = function() {
	return gulp.src(paths.distDevCss + '/*.css')
	.pipe(plugins.cleanCss())
	.pipe(gulp.dest(paths.distProd +'/css'));
};

pipes.buildProd = function() {
  var vendorScripts = pipes.buildVendorScriptsProd();
  var appScripts = pipes.buildAppScriptsProd();
  var appStyles = pipes.buildStylesProd();
		return gulp.src(paths.index)
			.pipe(gulp.dest(paths.distProd))
			.pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
			.pipe(plugins.inject(appScripts, {relative: true}))
			.pipe(plugins.inject(appStyles, {relative: true}))
			.pipe(gulp.dest(paths.distProd));
};

pipes.builtAppProd = function() {
  return es.merge(pipes.buildProd(), pipes.buildPartialsFilesProd(), pipes.processedImagesProd());
};

gulp.task('build', pipes.builtAppProd);

gulp.task('default', ['watch-dev']);
