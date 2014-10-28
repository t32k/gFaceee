module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jshint:
      all: ["*.js"]
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    version:
      files: ['manifest.json', 'bower.json']

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-sync-version'

  grunt.registerTask 'test', ['jshint', 'jsvalidate']
  grunt.registerTask 'default', ['test', 'version']