/**
 * Compile the documentation
 * @return {Stream}
 */
gulp.task('jsdoc', function(cb) {
  console.log('Compiling documentation');

  let config = require(config.jsdoc.config);

  gulp.src(config.jsdoc.src, {read: false})
    	.pipe(plugins.jsdoc3(config, cb));
});

