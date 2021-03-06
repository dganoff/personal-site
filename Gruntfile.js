module.exports = function(grunt) {

	"use strict";

	// Display the execution time when tasks are run:
	require('time-grunt')(grunt);

	// Configuration:
	var THEME = "DemetriDesign",
		SRC = "./src/",
		DIST = "./dist/",
		SERVER_PORT = "7777";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> ver. <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
			},
			dist: {
				files: {
					'.tmp/app.min.js': [SRC + 'js/*.js']
				}
			}
		},

		sass: {
			dist: {
				files: [{
					src : ['**/*.scss', '!**/_*.scss'],
					cwd : 'src/scss',
					dest : 'dist/css',
					ext : '.css',
					expand : true
				}],
				options: {
					style: 'compressed'
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: SERVER_PORT,
					base: DIST,
					livereload: true
				}
			}
		},

		watch: {
			// options: {
			// 	livereload: true
			// },
			scss: {
				files: [SRC + 'scss/**/*.scss'],
				tasks: 'sass'
			},
			css: {
				files: DIST + 'css/*.css',
				options: {
					livereload: true
				}
			},
			scripts: {
				files: [SRC + 'js/*.js'],
				tasks: ['uglify', 'concat', 'newer:copy:javascript'],
				options: {
					livereload: true
				}
			},
			html: {
				files: [
					SRC + 'templates/**/*.html',
					SRC + 'data/*.{json, yml}'
				],
				tasks: ['assemble', 'htmlhint'],
				options: {
					livereload: true
				}
			},
			images: {
				files: [SRC + 'images/*'],
				tasks: ['copy:images'],
				options: {
					livereload: true
				}
			}
		},

		jshint: {
			files: {
				src: ['src/js/*.js']
			}
		},

		assemble: {
			options: {
				flatten: true,
				// assets: "path/to/assets",
				layoutdir: SRC + 'templates/layouts',
				layout: 'layout.html',
				data: [SRC + "data/*.{json, yml}"],
				partials: ['src/templates/pages/*.html', 'src/templates/parts/*.html'],
				ext: '.html',
				theme: THEME,
				plugins: [ 'assemble-related-pages', 'permalinks' ]
			},
			pages: {
				files: {
					'dist': [SRC + 'templates/pages/*.html']
				}
			},
			blog: {
				// options: {
				// 	permalinks: {
				// 		structure: ':year/:month/:day/:basename:ext'
				// 	}
				// },
				files: {
					'dist/blog/': [SRC + 'templates/blog/*.html']
				}
			}
			// work: {
			// 	files: {
			// 		'dist/work/': [SRC + 'templates/work/*.html']
			// 	}
			// }
		},

		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'head-script-disabled': true,
					'style-disabled': true
				},
				src: [DIST + '**/*.html']
			}
		},

		copy: {
			javascript: {
				files: [
					{
						expand: true,
						src: [SRC + 'bower-components/jquery/jquery.min.map'], // apparently required for latest version of jQuery from bower
						flatten: true,
						dest: DIST + 'js'
					}
				]
			},
			images: {
				files: [
					{
						expand: true,
						src: [SRC + 'images/*'],
						flatten: true,
						dest: DIST + 'img'
					}
				]
			},
			fonts: {
				files: [
					{
						expand: true,
						src: [SRC + 'bower-components/font-awesome/fonts/*'],
						flatten: true,
						dest: DIST + 'fonts'
					}
				]
			}
		},

		concat: {
			options: {
				separator: ';\n'
			},
			dist: {
				src: [SRC + 'bower-components/jquery/jquery.min.js', SRC + 'js/vendor/prism.min.js', '.tmp/app.min.js'],
				dest: DIST + 'js/app.min.js'
			}
		},

		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		},

		clean: {
			build: {
				src: [
					DIST + "**/*.html",
					DIST + "fonts/*",
					DIST + "img/*",
					DIST + "css/*",
					DIST + "js/*"
				]
			}
		}
	});

	// Load Tasks:
	grunt.loadNpmTasks('assemble');
	// Load all Grunt tasks via matchdep:
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// Register Tasks:
	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('build', ['clean', 'sass', 'assemble', 'htmlhint', 'copy', 'jshint', 'uglify', 'concat']);
	grunt.registerTask('pages', ['build', 'gh-pages']);
};
