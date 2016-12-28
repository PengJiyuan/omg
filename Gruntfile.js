module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,

    concat: {
      dist: {
        options: {
          process: function(src, filepath) {
            return '\n' + '// Source: ' + filepath + '\n' +
              src.replace(/'<%%version%%>'/g, "'"+pkg.version+"'");
          },
        },
        files: {
          'dist/<%= pkg.name %>.js': pkg.files,
        }
      }
    },

    uglify: {
      options: {
        banner: '/*!\n * @Project: <%= pkg.name %>\n * @Version: v<%= pkg.version %> \n * @Author: <%= pkg.author %> \n * @Date: <%= grunt.template.today("yyyy-mm-dd") %>\n * @license: <%= pkg.license %>\n *\n * @homepage: <%= pkg.homepage %>\n */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'package.json'],
        tasks: ['build'],
        options: {
          spawn: false,
          interrupt: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

};