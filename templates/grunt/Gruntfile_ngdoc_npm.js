  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.registerTask('deploy', ['grunt-ngdocs', 'gh-pages']);
  grunt.registerTask('default', 'grunt-ngdocs');
