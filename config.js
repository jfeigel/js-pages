"use strict";

module.exports = () => {
	var config = {
		"dependencies": {
			"grunt": {
				"gh-pages": "grunt-gh-pages",
				"jsdoc": "grunt-jsdoc",
				"ngdocs": "grunt-ngdocs"
			},
			"gulp": {
				"gh-pages": "gh-pages",
				"jsdoc": "gulp-jsdoc3",
				"ngdocs": "gulp-ngdocs"
			}
		},
		"gh-pages": {
			"name": "gh-pages"
		},
		"jsdoc": {
			"conf": "jsdoc-conf.json"
		},
		"path": {
			"root": "node_modules/js-pages",
			"templates": "node_modules/js-pages/templates"
		}
	};

	return config;
}