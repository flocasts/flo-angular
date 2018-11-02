import { ViewportGridPage } from './viewport-grid.po'

describe('Viewport Grid', () => {
  it('should display welcome message', done => {
    const page = new ViewportGridPage()
    page
      .navigateTo()
      .then(() => {
        // const field = page.getMaxHeightInput()
        // field.clear().then(_ => {
        //   field.sendKeys(900)
        // })
        // expect(1).toEqual(1)
        // expect(page.getParagraphText()).toEqual('FloSports Angular')
        done()
      })
  })
})
