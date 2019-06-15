import { Component, ChangeDetectionStrategy, ContentChild, TemplateRef, HostListener, Input } from '@angular/core'
import { FloFullscreenOnDirective, FloFullscreenOffDirective } from './ng-fullscreen.directive'
import { map } from 'rxjs/operators'
import { FloFullscreenService } from './ng-fullscreen.service'

@Component({
  selector: 'flo-fullscreen',
  template: '<ng-container *ngTemplateOutlet="templateRef$ | async"></ng-container>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloFullscreenComponent {
  constructor(private fs: FloFullscreenService) { }

  @HostListener('click')
  click() {
    // tslint:disable: no-if-statement
    if (this.fs.isFullscreen()) {
      this.fs.exitFullscreen()
    } else if (this.targetRef) {
      this.fs.goFullscreen(this.targetRef)
    }
  }

  @ContentChild(FloFullscreenOnDirective, { read: TemplateRef }) readonly fullscreenOnTemplateRef: TemplateRef<HTMLElement>
  @ContentChild(FloFullscreenOffDirective, { read: TemplateRef }) readonly fullscreenOffTemplateRef: TemplateRef<HTMLElement>

  @Input()
  public readonly targetRef?: HTMLElement

  public readonly templateRef$ = this.fs.isFullscreen$.pipe(map(tf => {
    return tf ? this.fullscreenOnTemplateRef : this.fullscreenOffTemplateRef
  }))
}
