import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-autoplay',
  templateUrl: './autoplay.component.html',
  styleUrls: ['./autoplay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoplayComponent {
  // tslint:disable:readonly-keyword
  // tslint:disable:readonly-array
  public urls = [
    'http://techslides.com/demos/sample-videos/small.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  ]

  setVideo() {
    // tslint:disable-next-line:no-object-mutation
    this.urls = this.urls.reverse()
  }
}
