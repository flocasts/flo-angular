import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent {
  // tslint:disable: readonly-keyword
  value = 1

  ref: any

  setRef(ref: any) {
    // tslint:disable-next-line: no-object-mutation
    this.ref = ref
  }
}
