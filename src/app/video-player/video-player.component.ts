import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core'

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent {
  // tslint:disable: readonly-keyword
  // tslint:disable: no-object-mutation
  value = 1
  ref: any

  @ViewChild('vidRef1') vidRef1: ElementRef<HTMLVideoElement>

  ngAfterViewInit() {
    this.ref = this.vidRef1.nativeElement
  }

  setRef(ref: any) {
    this.ref = ref
  }
}
