module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'src/index.html',
      options:{
        dest: 'dist'
      }
    },

    usemin: {html:['dist/index.html']},

    copy:{
      task0: {
        src:'src/index.html', dest:'dist/index.html'
      }
    },

    // concat: {
    //   dist: {
    //     src: [
    //       'src/js/lib/*.js',
    //       'src/js/models/*.js',
    //       'src/js/collections/*.js',
    //       'src/js/views/*.js',
    //     ],
    //     dest: 'dist/js/production.js',
    //   }
    // },

    // uglify: {
    //   dist: {
    //     src: [
    //       'src/js/lib/*.js',
    //       'src/js/models/*.js',
    //       'src/js/collections/*.js',
    //       'src/js/views/*.js',
    //     ],
    //     dest: 'dist/js/production.min.js'
    //   }
    // },
    //
    // cssmin: {
    //   css: {
    //     files: {
    //       'dist/css/style.min.css': ['src/css/style.css'],
    //     }
    //   }
    // },

    imagemin: {
      jpg: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.jpg'],
          dest: 'dist/img/'
        }]
      },
      png: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.png'],
          dest: 'dist/img/'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true
        },
      files: {
        'dist/index.html': 'src/index.html'
      }
    },
      dev: {              //for development
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', '> 5%']
      },
      no_dest: {
        src: 'dist/css/style.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['copy:task0', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'imagemin', 'htmlmin', 'usemin', 'autoprefixer']);
};
