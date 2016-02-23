module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*', 'grunt-angular-*']});

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        wiredep: {
            task: {
                src: [
                    'public/index.html'
                ],
                options: {
                    bowerJson: grunt.file.readJSON('bower.json'),
                    directory: 'public/bower_components',
                    ignorePath: '../..'
                }
            }
        },

        clean: {
            styles: ['public/styles/app.css', 'public/styles/app.min.css'],
            docs: ['docs/**/*']
        },

        ngtemplates: {
            shellPortalSuperadmin: {
                src: 'public/app/**/*.html',
                dest: 'public/js/ng.app.min.js',
                options: {
                    append: true,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    prefix: '/',
                    url: function(url) { return url.replace(/^\/?public\//, ''); }
                }
            }
        },

        ngdocs: {
            app: {
                src: ['public/app/**/*.js'],
                title: 'Client',
                api: '/'
            },
            options: {
                dest: 'public/docs',
                scripts: [
                    'public/bower_components/angular/angular.min.js',
                    'public/bower_components/angular-animate/angular-animate.min.js'
                ],
                title: 'Shell Portal Super Admin',
                titleLink: 'https://github.com/sq1agency/shell-portal-superadmin',
                image: 'public/images/shell-logo.png',
                imageLink: 'https://github.com/sq1agency/shell-portal-superadmin',
                startPage: '/app',
                bestMatch: true
            }
        },

        // Converts SASS to CSS
        sass: {
            styles: {
                options: {
                    style: 'expanded',
                    cacheLocation: 'public/styles/_src/.sass-cache'
                },
                files: {
                    'public/styles/app.min.css': ['public/styles/_src/app.scss']
                }
            }
        },

        // Minifies CSS
        cssmin: {
            target: {
                files: {
                    'public/styles/app.min.css': ['public/styles/app.min.css']
                }
            }
        },

        // HTTP Server
        connect: {
            app: {
                options: {
                    port: 3000,
                    hostname: 'localhost',
                    open: true,
                    base: 'public',
                    livereload: true
                }
            },
            docs: {
                options: {
                    port: 3001,
                    hostname: 'localhost',
                    open: true,
                    base: 'public/docs',
                    livereload: true,
                    keepalive: true
                }
            }
        },

        // Watch directories for changes
        watch: {
            templates: {
                files: ['public/js/_ng/templates/*.html'],
                tasks: ['dev-scripts-app'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['public/styles/**/*.scss'],
                tasks: ['dev-styles'],
                options: {
                    livereload: true
                }
            },
            docs: {
                files: ['public/app/**/*.js'],
                tasks: ['clean:docs', 'ngdocs'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('dev', ['clean:styles', 'sass', 'clean:docs', 'ngdocs']);

    grunt.registerTask('docs', ['clean:docs', 'ngdocs', 'connect:docs', 'watch:docs']);
    grunt.registerTask('ngdoc', ['ngdocs']);

    grunt.registerTask('default', ['dev', 'connect:app', 'watch']);
};
