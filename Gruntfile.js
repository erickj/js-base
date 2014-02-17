module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: ['grail.min.js', 'grail.min.map']
    },

    closurecompiler: {
      minify: {
        files: {
          // Destination: Sources...
          'grail.min.js': ['lib/grail.js']
        },
        options: {
          'compilation_level': 'ADVANCED_OPTIMIZATIONS',
          'source_map_format': 'V3',
          'create_source_map': 'grail.min.map'
        }
      }
    },

    gjslint: {
      options: {
        flags: [
          '--closurized_namespaces=grail',
          '--strict',
          '--time',
//          '-r lib'
        ],
        reporter: {
          name: 'console'
        }
      },
      all: {
        src: 'lib/**/*.js'
      }
    }
  });

  grunt.registerTask(
      'minify', ['clean:build', 'gjslint', 'closurecompiler:minify']);

  grunt.loadNpmTasks('grunt-closurecompiler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-gjslint');
};
