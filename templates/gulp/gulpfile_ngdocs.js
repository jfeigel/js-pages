/**
 * Compile the documentation
 * @return {Stream}
 */
gulp.task('ngdocs', function() {
    console.log('Compiling documentation');

    return plugins.ngdocs.sections(config.ngdocs.sections)
        .pipe(plugins.ngdocs.process(config.ngdocs.options))
        .pipe(gulp.dest(config.ngdocs.dest));
});
