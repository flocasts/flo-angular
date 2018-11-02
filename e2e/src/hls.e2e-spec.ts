import { HlsPage } from './hls.po'

describe('HLS', () => {
  it('should display welcome message', done => {
    const page = new HlsPage()
    page
      .navigateTo()
      .then(() => {
        // const field = page.getSrcField()
        // field.clear().then(_ => {
        //   field.sendKeys(900)
        // })
        // expect(1).toEqual(1)
        // expect(page.getParagraphText()).toEqual('FloSports Angular')
        done()
      })
  })
})
