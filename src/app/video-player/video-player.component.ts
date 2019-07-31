import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent {
  constructor(private cd: ChangeDetectorRef) { }
  // tslint:disable: readonly-keyword
  // tslint:disable: no-object-mutation
  value = 1
  ref: any

  @ViewChild('vidRef1') vidRef1: ElementRef<HTMLVideoElement>

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    this.setRef(this.vidRef1.nativeElement)
  }

  setRef(ref: any) {
    this.ref = ref
    this.cd.detectChanges()
  }
}
