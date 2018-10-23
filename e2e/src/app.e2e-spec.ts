import { AppPage } from './app.po'

describe('App', () => {
  // tslint:disable-next-line:no-let
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('should display welcome message', () => {
    expect(page.getParagraphText()).toEqual('FloSports Angular')
  })
})
