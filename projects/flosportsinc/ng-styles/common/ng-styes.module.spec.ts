import { StylesModule } from './ng-styles.module'
import { TestBed } from '@angular/core/testing'

describe(StylesModule.name, () => {
  it('should import ', () => {
    TestBed.configureTestingModule({
      imports: [StylesModule]
    })
    expect(StylesModule).toBeTruthy() // placeholder until tests are needed, if ever
  })
})
