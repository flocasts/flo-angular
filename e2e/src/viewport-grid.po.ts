import { browser } from 'protractor'

export class ViewportGridPage {
  navigateTo() {
    return browser.get('/viewport-grid')
  }
}
