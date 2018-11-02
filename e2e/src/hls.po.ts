import { browser, by, element } from 'protractor'

export class HlsPage {
  // constructor() {
  //   browser.ignoreSynchronization = true
  // }

  navigateTo() {
    return browser.get('/hls')
  }

  getSrcSelection() {
    return element(by.id('preselected_input'))
  }
}
