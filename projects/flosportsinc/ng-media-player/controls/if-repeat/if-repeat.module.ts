import { NgModule } from '@angular/core'
import { FloMediaIfRepeatDisabledPlayingDirective, FloMediaIfRepeatEnabledDirective } from './if-repeat.directive'

@NgModule({
  declarations: [
    FloMediaIfRepeatEnabledDirective,
    FloMediaIfRepeatDisabledPlayingDirective
  ],
  exports: [
    FloMediaIfRepeatEnabledDirective,
    FloMediaIfRepeatDisabledPlayingDirective
  ]
})
export class FloMediaIfRepeatModule { }
