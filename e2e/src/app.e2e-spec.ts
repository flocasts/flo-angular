import { AppPage } from './app.po'

describe('App', () => {
  it('should display welcome message', done => {
    const page = new AppPage()
    page.navigateTo()
      .then(() => {
        expect(page.getParagraphText()).toEqual('FloSports Angular')
        done()
      })
  })
})
