import { browser, element, by } from 'protractor'
import { BaseBrowser } from './browser.po'

export class ViewportGridPage extends BaseBrowser {
  navigateTo() {
    return browser.get('/viewport-grid')
  }
  getParagraphText() {
    return element(by.css('h1')).getText()
  }
}
