module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            report: 'gzip', 
            target: {
                files: {'./dist/output.min.css': [
                    "./lib/normalize.css"              ,
                    "./style/main.css"                 ,
                    "./lib/medium-editor.min.css" ,
                    "./lib/medium.default.min.css",
                    "./lib/jquery.textcomplete.css" ,
                    "./lib/medium-editor-tables.min.css"
                ]}
            }
        },
        uglify: {
            my_target: {
                files: {
                    './dist/output.min.js':
                    [
                        "./lib/jquery.min.js"              ,
                        "./lib/jquery.the-modal.js",
                        "./lib/vanilla-color-picker.min.js",
                        "./lib/medium-editor.min.js"       ,
                        "./lib/jquery.textcomplete.min.js" ,
                        // "./lib/store.min.js"               ,
                        "./lib/medium.color.ext.js"        ,
                        "./lib/medium-editor-tables.min.js",
                        "./lib/d3.js"                      ,
                        "./lib/lodash.min.js"              ,
                        "./afterInit.js"                   ,
                        "./src/GOO.js"                     ,
                        ]
                }
            }
        },
        shell: {
            multiple: {
                command: [
                    'cp -r ./fonts ./dist/'
                ].join('&&')
            }
        }        
    })
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');
    // Default task(s).
    grunt.registerTask('build', ["cssmin","uglify","shell"]);

};
