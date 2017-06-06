/*!
 * gulp
 * $
  cnpm install gulp run-sequence gulp-sass gulp-rev gulp-rev-collector  gulp-autoprefixer gulp-minify-css gulp-htmlmin gulp.spritesmith gulp-jshint gulp-concat gulp-order gulp-uglify gulp-imagemin gulp-notify gulp-rename browser-sync gulp-cache del --save-dev
 */
// 加载各个模块
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    spritesmith = require('gulp.spritesmith'),
    //jshint = require('gulp-jshint'),
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'), //- 路径替换
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del');
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var scssSrc = 'src/scss/*.scss',
	cssDist = 'dist/css',

	jsSrc = 'src/js/*.js',
	jsDist = 'dist/js',

	fontSrc = 'src/fonts/*',
	fontDist = 'dist/font',

	imgSrc = 'src/images/*',
	imgDist = 'dist/images',

    revSrc = 'src/rev';


//删除dist目录下文件
gulp.task('clean',function(cb){
    return del(['dist/css/*'],cb);
})

// sass编译
gulp.task('sass', function() {
    return gulp.src([scssSrc])
        .pipe(sass())
        .pipe(minifycss())
        .pipe(autoprefixer({
             browsers:['last 4 versions'],
             cascade:true, //是否美化属性值 默认：true 
             remove:true //是否去掉不必要的前缀 默认：true
         }))
        //.pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest(cssDist)) //- 输出文件本地
        //.pipe(rev.manifest()) //- 生成一个rev-manifest.json
        //.pipe(gulp.dest(revSrc)) //- 将 rev-manifest.json 保存到 rev 目录内
        // .pipe(notify({ message: 'scss编译完成,开始更新页面' }))
        .pipe(reload({ stream: true }))
});
// 图片压缩
gulp.task('image-min', function() {
    return gulp.src(imgSrc)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(imgDist))
});
//雪碧图
// gulp.task('sprite', [], function() {
//     return gulp.src('src/images/{*icon*,*btn*}.{jpg,png}')
//         .pipe(spritesmith({
//             imgName: 'dist/images/sprite.png',
//             cssName: 'dist/css/sprite.css',
//             algorithm: 'top-down',
//         }))
//         .pipe(gulp.dest(''));
// });
// js合并压缩
gulp.task('js', function() {
    return gulp.src([jsSrc])
        .pipe(order([
            "jquery.js",
            "*.js",
        ]))
        .pipe(concat('concat.js'))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(uglify()) // js压缩
        .pipe(gulp.dest(jsDist)) 
        // .pipe(notify({ message: 'js压缩完成,开始更新页面' }))
        .pipe(reload({ stream: true })) 
});
gulp.task('html-rev', [], function() {
    var options = {
        collapseWhitespace: true,            //压缩html
        collapseBooleanAttributes: true,     //省略布尔属性的值
        removeComments: true,                //清除html注释
        removeEmptyAttributes: true,         //删除所有空格作为属性值
        removeScriptTypeAttributes: true,    //删除type=text/javascript
        removeStyleLinkTypeAttributes: true, //删除type=text/css
        minifyJS:true,                       //压缩页面js
        minifyCSS:true                       //压缩页面css
    }
    gulp.src(['src/rev/*.json', 'src/*.html'])
        //.pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'))
        // .pipe(notify({ message: 'html压缩完成,开始更新页面' }))
        .pipe(reload({ stream: true }));
});
// 启动服务
gulp.task('server', ['clean'], function() {
    // gulp.start('sass','js','image-min','html');
    gulp.start('image-min')
    runSequence(['sass'],['js'],['html-rev']);
    browserSync.init({
        port: 9999,
        server: {
            baseDir: ['./dist']
        }
    });
    // 文件变化自动刷新
    gulp.watch(scssSrc,['sass']);
    gulp.watch(jsSrc, ['js']);
    gulp.watch(imgSrc, ['image-min']);
    gulp.watch('src/*.html', ['html-rev']);
    gulp.watch(['dist/*.html',jsDist,cssDist]).on('change', reload);
});

gulp.task('default',['server']);