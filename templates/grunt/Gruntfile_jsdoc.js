  gruntConfig['jsdoc'] = {
    dist: {
      src: ['**/*.js', '!node_modules', '!public/bower_components'],
      options: {
        destination: 'docs',
        configure: 'jsdoc-conf.json'
      }
    }
  };

