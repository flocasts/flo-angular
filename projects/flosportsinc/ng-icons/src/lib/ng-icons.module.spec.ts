import { IconsModule } from './ng-icons.module'
import { TestBed } from '@angular/core/testing'
import { Icon } from './icons'

describe(IconsModule.name, () => {
  it('should import module ', () => {
    TestBed.configureTestingModule({
      imports: [IconsModule]
    })
    expect(IconsModule).toBeTruthy() // placeholder until tests are needed, if ever
  })

  it('should enum', () => {
    expect(Icon.FA_YOUTUBE).toEqual('youtube')
  })
})
