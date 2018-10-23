import { AppPage } from './app.po'

describe('App', () => {
  it('should display welcome message', () => {
    const page = new AppPage()
    expect(page.getParagraphText()).toEqual('FloSports Angular')
  })
})
