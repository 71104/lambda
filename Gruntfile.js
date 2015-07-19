module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['bin', 'doc/html']
		},
		concat: {
			dist: {
				src: [
					'src/Errors.js',
					'src/Utilities.js',
					'src/Context.js',
					'src/Values.js',
					'src/AST.js',
					'src/Closures.js',
					'src/FixNode.js',
					'src/Arrays.js',
					'src/Operators.js',
					'src/DefaultContext.js',
					'src/Lexer.js',
					'src/Parser.js',
				],
				dest: 'bin/lambda.js'
			}
		},
		jshint: {
			options: {
				camelcase: true,
				curly: true,
				forin: true,
				immed: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				nonbsp: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				trailing: true,
				boss: true,
				multistr: true,
				smarttabs: true,
				node: true
			},
			dist: 'bin/lambda.js'
		},
		uglify: {
			options: {
				wrap: 'exports'
			},
			dist: {
				files: {
					'bin/lambda.min.js': 'bin/lambda.js'
				}
			}
		},
		copy: {
			dist: {
				src: 'src/Main.js',
				dest: 'bin/Main.js'
			}
		},
		nodeunit: {
			dist: [
				'test/lexer.js',
				'test/parser.js',
				'test/free.js',
				'test/marshal.js',
			]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'copy']);
	grunt.registerTask('test', ['nodeunit']);
	grunt.registerTask('all', ['clean', 'concat', 'jshint', 'uglify', 'copy', 'nodeunit']);
};
