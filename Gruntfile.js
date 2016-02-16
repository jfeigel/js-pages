module.exports = function (grunt) {

  grunt.initConfig({
    'gh-pages': {
      'js-pages': {
        src: ['**'],
        options: {
          base: 'docs'
        }
      }
    },

    jsdoc: {
      dist: {
        src: ['app.js'],
        options: {
          destination: 'docs',
          configure: 'jsdoc-conf.json'
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