import { Component, ChangeDetectionStrategy, ContentChild, TemplateRef, HostListener, Input } from '@angular/core'
import { FloFullscreenOnDirective, FloFullscreenOffDirective } from './ng-fullscreen.directive'
import { map, take, filter, tap } from 'rxjs/operators'
import { FloFullscreenService } from './ng-fullscreen.service'
import { merge } from 'rxjs'

@Component({
  selector: 'flo-fullscreen',
  template: '<ng-container *ngTemplateOutlet="templateRef$ | async"></ng-container>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloFullscreenComponent {
  constructor(private fs: FloFullscreenService) { }

  @HostListener('click')
  click() {
    merge(
      this.fs.isFullscreen$.pipe(tap(_ => this.fs.exitFullscreen())),
      this.fs.isNotFullscreen$.pipe(tap(_ => this.targetRef && this.fs.goFullscreen(this.targetRef)))
    ).pipe(take(1)).subscribe()
  }

  @ContentChild(FloFullscreenOnDirective, { read: TemplateRef }) readonly fullscreenOnTemplateRef: TemplateRef<HTMLElement>
  @ContentChild(FloFullscreenOffDirective, { read: TemplateRef }) readonly fullscreenOffTemplateRef: TemplateRef<HTMLElement>

  @Input()
  public readonly targetRef?: HTMLElement

  public readonly templateRef$ = this.fs.fullscreen$.pipe(map(tf => tf ? this.fullscreenOnTemplateRef : this.fullscreenOffTemplateRef))
}
