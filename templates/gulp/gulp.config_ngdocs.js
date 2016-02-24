  let ngdocs = {
    // Destination of the compiles docs
    //   Also make sure to include this in your .gitignore
    dest: './docs/',
    // Tabs in the docs and the content for each
    sections: {
      api: {
        // Files to include
        glob: ['./**/*.js', '!./node_modules', '!./public/bower_components'],
        // Name of the tab
        title: 'Client'
      }
    },
    options: {
      // Include your own version of Angular to match your project
      scripts: [
        './public/bower_components/angular/angular.min.js',
        './public/bower_components/angular-animate/angular-animate.min.js'
      ],
      // Title of the docs
      title: 'Documentation',
      // Where the Title should link to
      titleLink: 'https://github.com/jfeigel/js-pages',
      // Logo image
      image: './public/images/logo.png',
      // Where the Logo image should link to
      imageLink: 'https://github.com/jfeigel/js-pages',
      // Which Section and Page should the user be directed to
      //   '/<section>/<page>'
      startPage: '/api/app',
      bestMatch: true,
      html5Mode: false
    }
  };

  config.ngdocs = ngdocs;

