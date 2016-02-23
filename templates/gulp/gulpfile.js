"use strict";

const config = require('./gulp.config')();
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({lazy: true});

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

/**
 * Publish the documentation to the `gh-pages` branch
 * @return {Stream}
 */
gulp.task('gh-pages', [], function() {
    console.log('Pushing docs to gh-pages');

    let ghpages = require('gh-pages');

    ghpages.publish(config.ngdocs.dest);
});