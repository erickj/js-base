module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: ['grail.min.js', 'grail.min.map'],
      spec: ['tmp']
    },

    closurecompiler: {
      spec: {
        files: {
          'tmp/spec/grail_spec.js': ['spec/**/*.js', 'lib/**/*.js']
        },
        options: {
          'compilation_level': 'SIMPLE_OPTIMIZATIONS',
          'externs': ['externs/jasmine.js'],
          'formatting': 'PRETTY_PRINT',
          'manage_closure_dependencies': true
        }
      },
      minify: {
        files: {
          // Destination: Sources...
          'grail.min.js': ['lib/**/*.js']
        },
        options: {
          'compilation_level': 'ADVANCED_OPTIMIZATIONS',
          'source_map_format': 'V3',
          'create_source_map': 'grail.min.map',
          'flagfile': '.closureflags'
        }
      }
    },

    gjslint: {
      options: {
        flags: [
          '--strict',
          '--custom_jsdoc_tags namespace'
        ],
        reporter: {
          name: 'console'
        }
      },
      lib: {
        src: 'lib/**/*.js'
      },
      spec: {
        src: 'spec/**/*.js'
      }
    },

    jasmine: {
      grail: {
        options : {
          specs : 'tmp/spec/**/*.js'
        }
      }
    }
  });

  grunt.registerTask(
      'minify', ['clean:build', 'gjslint:lib', 'closurecompiler:minify']);
  grunt.registerTask('test', ['clean:spec', 'closurecompiler:spec', 'jasmine']);

  grunt.loadNpmTasks('grunt-closurecompiler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-gjslint');

  grunt.registerTask('default', ['test']);
};
