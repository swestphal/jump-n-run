var gulp = require('gulp'),
    watch = require('gulp-watch'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssvars = require('postcss-simple-vars'),
    nested = require('postcss-nested'),
    cssImport = require('postcss-import'),
    rename = require('gulp-rename'),
    mixins = require('postcss-mixins'),
    browserSync = require('browser-sync').create(),
    stripComments = require('gulp-strip-comments'),
    svgSprite = require('gulp-svg-sprite'),
    del = require('del'),
    hexrgba = require('postcss-hexrgba'),
    webpack = require('webpack'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    jasmine = require('gulp-jasmine-phantom');

var config = {
    mode: {
        css: {
            render: {
                css: {
                    template: './gulp/templates/sprite.css'
                }
            }
        }
    }
};

gulp.task('lint', function() {
    return gulp.src(['./app/assets/scripts/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('unitTests', function() {
    gulp.src('tests/spec/extraSpec.js')
        .pipe(jasmine());
});

gulp.task('integrationTests', function() {
    gulp.src('tests/spec/extraSpec.js')
        .pipe(jasmine({
            integration: true
        }));
});

gulp.task('createSprite', ['beginClean'], function() {
    return gulp.src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./app/assets/sprite/'));
});

gulp.task('copySpriteCss', function() {
    var newSprite = gulp.src('./app/assets/sprite/css/*.css')
        .pipe(rename('_sprite.pcss'))
        .pipe(gulp.dest('./app/assets/styles/modules/'));
    var deleteOldCss = del('./app/assets/sprite/css/sprite.css');
    return [newSprite, deleteOldCss];
});

gulp.task('beginClean', function() {
    return del(['./app/assets/images/sprite', './app/assets/styles/modules/_sprite.pcss'])
});

gulp.task('default', function() {

});

gulp.task('html', function() {
    console.log("html changed");
});

gulp.task('scripts', function(callback) {
    webpack(require('./webpack.config.js'), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString());
        callback();
    });
});


gulp.task('styles', function() {

    return gulp.src('./app/assets/styles/style.pcss')
        .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
        .on('error', function(errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end')
        })
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./app/assets/css/style/'));
});


gulp.task('cssInject', ['styles'], function() {
    return gulp.src('./app/assets/styles/style.pcss')
        .pipe(browserSync.stream());
});



gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });


    watch('./app/index.html', function() {
        browserSync.reload();
    });
    watch('./app/assets/styles/**/*.pcss', function() {
        gulp.start('cssInject');
    });

    watch('./app/assets/scripts/**/*.js', function() {
        gulp.start('scriptsRefresh');
        gulp.start('lint');
    });
});



gulp.task('scriptsRefresh', ['scripts'], function() {
    browserSync.reload();
});

gulp.task('delDistFolder', function() {
    return del('./dist');
});

gulp.task('copyGeneralFiles', ['delDistFolder'], function() {
    var pathsToCopy = [
        './app/**/*',
        '!./app/assets/css/**',
        '!./app/assets/images/**',
        '!./app/assets/scripts/**',
        '!./app/assets/sprite/**/*',
        '!./app/assets/styles/**/*',
    ]
    return gulp.src(pathsToCopy, { nodir: true })
        .pipe(gulp.dest('./dist'));
});

gulp.task('optimizeImages', ['delDistFolder'], function() {
    return gulp.src(['./app/assets/images/**/**/**.*', ])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 5,
            multipass: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/assets/images/'));
});

gulp.task('usemin', ['delDistFolder', 'copyGeneralFiles', 'styles', 'scripts'], function() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [function() { return rev() }, function() { return cssnano() }],
            js: [function() { return rev() }, function() { return uglify() }]
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['delDistFolder', 'optimizeImages', 'usemin']);

gulp.task('previewDist', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});