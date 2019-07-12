import { browser, by, element } from 'protractor'
import { BaseBrowser } from './browser.po'

export class AppPage extends BaseBrowser {
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
    return element(by.css('ul.unstyled'))
  }

  getId(id: string) {
    return element(by.id(id))
  }
}
