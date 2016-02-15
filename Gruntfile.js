module.exports = function (grunt) {

  grunt.initConfig({
    jsdoc: {
      dist: {
        src: ['app.js'],
        options: {
          destination: 'docs'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['grunt-jsdoc']);

};