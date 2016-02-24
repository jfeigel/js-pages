/**
 * Publish the documentation to the `gh-pages` branch
 * @return {Stream}
 */
gulp.task('gh-pages', [], function () {
  console.log('Pushing docs to gh-pages');

  const ghpages = require('gh-pages');

  ghpages.publish(config['gh-pages'].dest);
});

