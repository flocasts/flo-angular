import { AppPage } from './app.po'
import { browser, by } from 'protractor'

describe('App', () => {
  it('should display welcome message', done => {
    const page = new AppPage()
    page
      .navigateTo()
      .then(() => {
        expect(page.getParagraphText()).toEqual('FloSports Angular')
        done()
      })
  })

  it('should have state transfer script', done => {
    const page = new AppPage()
    page
      .navigateTo()
      .then(() => {
        expect(page.getStateTransfer().getTagName()).toEqual('script')
        done()
      })
  })

  it('should navigate to the HLS demo page when link in nav is clicked', done => {
    const page = new AppPage()
    page
      .navigateTo()
      .then(() => {
        page.getNav().getWebElement().findElement(by.css('li a[href="/hls"]'))
          .click()
          .then(() => {
            expect(browser.getTitle()).toEqual('FloSports Component Library')
            done()
          })
      })
  })

  it('should navigate to the viewport-grid demo page when clicked from the navigation menu', done => {
    const page = new AppPage()
    page
      .navigateTo()
      .then(() => {
        page.getNav().getWebElement().findElement(by.css('li a[href="/viewport-grid"]'))
          .click()
          .then(() => {
            expect(browser.getTitle()).toEqual('FloSports Component Library')
            done()
          })
      })
  })
})
