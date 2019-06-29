import { Directive, Input, TemplateRef, ViewContainerRef, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { DOCUMENT, isPlatformServer } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floIfMediaAdjustableVolume]'
})
export class FloMediaIfAdjustableVolumeDirective implements OnInit {
  constructor(private tr: TemplateRef<HTMLElement>, private vc: ViewContainerRef,
    @Inject(DOCUMENT) private doc: any, @Inject(PLATFORM_ID) private platformId: string) { }

  @Input() readonly floIfMediaAdjustableVolume: any

  ngOnInit() {
    if (isPlatformServer(this.platformId)) { return }

    // test if able to mutate volume, iOS cannot so don't render control.
    const video = (this.doc as HTMLDocument).createElement('video')
    video.volume = 0.125

    if (video.volume === 0.125) {
      this.vc.createEmbeddedView(this.tr)
    }
    video.remove()
  }
}
