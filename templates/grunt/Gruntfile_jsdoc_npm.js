  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('deploy', ['grunt-jsdoc', 'gh-pages']);
  grunt.registerTask('default', 'grunt-jsdoc');
