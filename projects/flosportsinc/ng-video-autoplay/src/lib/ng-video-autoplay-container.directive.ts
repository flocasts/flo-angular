import { Directive, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, ContentChild } from '@angular/core'
import { VideoAutoplayDirective } from './ng-video-autoplay.directive'

@Directive({
  selector: '[floAutoplayContainer]'
})
export class VideoAutoplayContainerDirective  {
  @ContentChild(VideoAutoplayDirective) public readonly video?: ElementRef<any>

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterContentInit() {
    console.log('TEST')
    console.log(this.video)
  }
}
