  gruntConfig['ngdocs'] = {
    app: {
      src: ['public/**/*.js'],
      title: 'Client',
      api: '/'
    },
    options: {
      dest: 'public/docs',
      scripts: [
        'public/bower_components/angular/angular.min.js',
        'public/bower_components/angular-animate/angular-animate.min.js'
      ],
      title: 'Documentation',
      titleLink: 'https://github.com/jfeigel/js-pages',
      image: 'public/images/logo.png',
      imageLink: 'https://github.com/jfeigel/js-pages',
      startPage: '/api/app',
      bestMatch: true,
      html5Mode: false
    }
  };

