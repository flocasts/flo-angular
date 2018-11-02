import { browser } from 'protractor'

export class BaseBrowser {
  constructor() {
    browser.waitForAngularEnabled(false)
  }
}
