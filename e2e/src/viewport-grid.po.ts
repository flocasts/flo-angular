import { browser, element, by } from 'protractor'

export class ViewportGridPage {
  navigateTo() {
    return browser.get('/viewport-grid')
  }
  getParagraphText() {
    return element(by.css('h1')).getText()
  }
}
