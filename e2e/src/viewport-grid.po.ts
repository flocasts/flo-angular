import { browser, element, by } from 'protractor'

export class ViewportGridPage {
  constructor() {
    browser.ignoreSynchronization = true
  }

  navigateTo() {
    return browser.get('/viewport-grid')
  }
  getParagraphText() {
    return element(by.css('h1')).getText()
  }
}
