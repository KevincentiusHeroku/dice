
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],

    files: [
      'src/**/*.ts',
      // 'src/**/!(*spec)*.ts',
      // 'src/**/dice.getter.data.2.spec.ts',
      // 'src/**/dice.getter.data.spec.ts',
      // 'src/**/dice.getter.spec.ts',
    ],

    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },

    reporters: ['kjhtml', 'coverage'],

    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      subdir: '.'
    },

    port: 9876,

    browsers: ['Chrome'],

    karmaTypescriptConfig: {
      compilerOptions: {
        target: "esnext",
        lib: ["esnext"]
      },
      tsconfig: "tsconfig.json"
    },
    
    plugins: [
      'karma-jasmine',
      'karma-typescript',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter'
    ],
  })
}
