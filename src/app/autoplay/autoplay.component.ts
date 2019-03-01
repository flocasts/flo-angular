import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-autoplay',
  templateUrl: './autoplay.component.html',
  styleUrls: ['./autoplay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoplayComponent {
  public readonly urls: ReadonlyArray<any> = [
    'http://techslides.com/demos/sample-videos/small.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  ]
}
