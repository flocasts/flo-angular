import { browser, by, element } from 'protractor'
import { BaseBrowser } from './browser.po'

export class HlsPage extends BaseBrowser {
  navigateTo() {
    return browser.get('/hls')
  }

  getSrcSelection() {
    return element(by.id('preselected_input'))
  }
}
