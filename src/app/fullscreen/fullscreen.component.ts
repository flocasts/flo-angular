import { Component, ChangeDetectionStrategy } from '@angular/core'
import { FloFullscreenService } from '@flosportsinc/ng-fullscreen'

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent  {
  constructor(fs: FloFullscreenService) {
    fs.fullscreen$.subscribe(a => console.log('is:', a))
  }
}
