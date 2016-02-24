  gruntConfig['ngdocs'] = {
    app: {
      src: ['**/*.js', '!node_modules', '!public/bower_components'],
      title: 'App Documentation',
    },
    options: {
      dest: 'docs',
      // scripts: [
      //   'public/bower_components/angular/angular.min.js',
      //   'public/bower_components/angular-animate/angular-animate.min.js'
      // ],
      title: 'Documentation',
      titleLink: 'https://github.com/jfeigel/js-pages',
      imageLink: 'https://github.com/jfeigel/js-pages',
      startPage: '/app',
      bestMatch: true,
      html5Mode: false
    }
  };

