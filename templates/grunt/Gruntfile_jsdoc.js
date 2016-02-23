  gruntConfig['jsdoc'] = {
    dist: {
      src: ['app.js'],
      options: {
        destination: 'docs',
        configure: 'jsdoc-conf.json'
      }
    }
  };

