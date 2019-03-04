import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'flo-chromecast',
  template: `
    <p>
      ng-chromecast works!
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloChromecastComponent { }
