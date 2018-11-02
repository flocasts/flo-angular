import { browser, by, element } from 'protractor'

export class HlsPage {
  navigateTo() {
    return browser.get('/hls')
  }

  getSrcSelection() {
    return element(by.id('preselected_input'))
  }
}
