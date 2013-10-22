module.exports = function(grunt) {

	"use strict";

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
					'src/js/output/app.min.js': [SRC + 'js/*.js']
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
			options: {
				livereload: true
			},
			scss: {
				files: [SRC + 'scss/**/*.scss'],
				tasks: 'sass'
			},
			css: {
			    files: DIST + 'css/*.css'
			},
			scripts: {
				files: [SRC + 'js/*.js'],
				tasks: ['uglify', 'concat']
			},
			html: {
				files: [SRC + 'templates/**/*.hbs', SRC + 'data/*.{json, yml}'],
				tasks: ['clean', 'assemble']
			},
			images: {
				files: [SRC + 'images/*'],
				tasks: ['copy']
			}
		},

		jshint: {
			files: {
				src: ['src/js/*.js', 'dist/js/*.js']
			}
		},

		assemble: {
			options: {
				flatten: true,
				// assets: "path/to/assets",
        		layoutdir: SRC + 'templates/layouts',
				layout: 'layout.hbs',
				data: [SRC + "data/*.{json, yml}"],
				partials: ['src/templates/pages/*.hbs', 'src/templates/parts/*.hbs'],
				ext: '.html',
				theme: THEME,
				plugins: [ 'assemble-related-pages' ]
			},
			pages: {
				files: {
		        	dist: [SRC + 'templates/pages/*.hbs']
		        }
			},
			blog: {
				files: {
					'dist/blog/': [SRC + 'templates/blog/*.hbs']
				}
			}
		},

		copy: {
			javascript: {
				files: [
					{
						expand: true,
						src: [SRC + 'bower-components/jquery/jquery.min.js'],
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
						src: [SRC + 'bower-components/font-awesome/font/*'],
						flatten: true,
						dest: DIST + 'font'
					}
				]
			}

		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [SRC + 'bower-components/jquery/jquery.min.js', SRC + 'js/output/app.min.js'],
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
				src: [DIST + "**/*.html"]
			}
		}
	});

	// Load Tasks:
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Register Tasks:
	grunt.registerTask('default', ['assemble']);
	grunt.registerTask('dev', ['connect', 'watch']);
	grunt.registerTask('pages', ['gh-pages']);
};
