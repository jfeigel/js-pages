# :notebook: js-pages

Custom Git script to compile JSDoc / ngdoc and deploy to gh-pages

### Install / Run
```
npm install js-pages
node node_modules/js-pages
```
-
1. Choose [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/) as your task runner to get a pre-built template.
1. Choose jsdoc, [Grunt version](https://github.com/krampstudio/grunt-jsdoc) or [Gulp version](https://github.com/mlucool/gulp-jsdoc3), or ngdoc, [Grunt version](https://github.com/m7r/grunt-ngdocs) or [Gulp version](https://github.com/nikhilmodak/gulp-ngdocs), as your documentation generator.
1. Choose a custom git alias that will be configured for your local repository (defaults to _pushdoc_)
1. Choose whether or not `sudo` is used to install your npm packages
