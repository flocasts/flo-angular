import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-autoplay',
  templateUrl: './autoplay.component.html',
  styleUrls: ['./autoplay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoplayComponent {
  // tslint:disable:no-object-mutation
  // tslint:disable-next-line:readonly-keyword
  public videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'

  setVideo(number: number) {
    switch (number) {
      case 2: this.videoSrc = 'http://techslides.com/demos/sample-videos/small.mp4'
        break
      case 1: this.videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
        break
    }
  }
}
