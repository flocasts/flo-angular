import { IconsModule } from './ng-icons.module'
import { TestBed } from '@angular/core/testing'

describe('Icons Module', () => {
  it('should import module ', () => {
    TestBed.configureTestingModule({
      imports: [IconsModule]
    })
    expect(IconsModule).toBeTruthy() // placeholder until tests are needed, if ever
  })
})
