/* tslint:disable:object-literal-sort-keys */
import { browser, ExpectedConditions as EC, Config } from 'protractor'
declare const global: any

const conf: Config = {
  specs: ['./specs/**/*.spec.ts'],

  framework: 'mocha',
  mochaOpts: {
    timeout: 25000
  },
  multiCapabilities: [{
    browserName: 'chrome',
    maxInstances: 5,
    shardTestFiles: true
  }],

  allScriptsTimeout: 30 * 1000,

  // restartBrowserBetweenTests: true,
  SELENIUM_PROMISE_MANAGER: false,

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)
  },
  beforeEach: async () => {
    browser.waitForAngularEnabled(false)
  }
}

exports.config = conf