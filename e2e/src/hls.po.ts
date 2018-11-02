import { browser, by, element } from 'protractor'

export class HlsPage {
  navigateTo() {
    return browser.get('/hls')
  }

  getSrcField() {
    return element(by.id('src'))
  }
}
