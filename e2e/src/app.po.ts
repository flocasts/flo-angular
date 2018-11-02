import { browser, by, element } from 'protractor'

export class AppPage {
  constructor() {
    browser.ignoreSynchronization = true
  }

  navigateTo() {
    return browser.get('/')
  }

  getParagraphText() {
    return element(by.css('h1')).getText()
  }

  getStateTransfer() {
    return element(by.css('#my-app-state')).getWebElement()
  }

  getNav() {
    return element(by.css('ul.primary-nav'))
  }
}
