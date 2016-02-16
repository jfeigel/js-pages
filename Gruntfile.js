module.exports = function (grunt) {

  grunt.initConfig({
    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    },

    jsdoc: {
      dist: {
        src: ['app.js'],
        options: {
          destination: 'docs'
        }
      }
    },

    watch: {
      scripts: {
        files: ['app.js'],
        tasks: ['jsdoc'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('deploy', ['jsdoc', 'gh-pages']);
  grunt.registerTask('default', ['jsdoc', 'watch']);

};