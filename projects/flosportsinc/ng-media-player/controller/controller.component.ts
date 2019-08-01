import {
  Component, Input, ChangeDetectionStrategy, ContentChild, TemplateRef,
  HostBinding, HostListener, ElementRef, ChangeDetectorRef, OnInit, OnDestroy, SimpleChanges, OnChanges
} from '@angular/core'
import {
  FloMediaPlayerPlayBtnControlTemplateDirective,
  FloMediaPlayerPlayBtnControlContentTemplateDirective,
  FloMediaPlayerPauseBtnControlTemplateDirective,
  FloMediaPlayerPauseBtnControlContentTemplateDirective
} from './controller.directives'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-media-player-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloMediaPlayerControllerComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private elm: ElementRef<HTMLDivElement>, private cd: ChangeDetectorRef) { }

  @HostBinding('class.fs') readonly fs = true
  @HostBinding('class.mp') readonly mp = true
  @HostBinding('class.controller') readonly controller = true
  @HostBinding('class.hide')
  get hide() {
    return !this.mediaRef || !(this.mediaRef instanceof HTMLMediaElement) || this.mediaRef.controls
  }

  @HostListener('mousedown', ['$event'])
  mousedown(evt: MouseEvent) {
    if (!(evt.target instanceof HTMLInputElement)) {
      evt.preventDefault()
    }
  }

  @Input() readonly mediaRef: HTMLMediaElement

  private _fullscreenRef: HTMLElement

  @Input()
  get fullscreenRef() {
    return this._fullscreenRef || this.mediaRef
  }
  set fullscreenRef(val: HTMLElement) {
    this._fullscreenRef = val instanceof HTMLElement
      ? val
      : this.mediaRef
  }

  @ContentChild(FloMediaPlayerPlayBtnControlTemplateDirective, { read: TemplateRef })
  readonly floMpPlayTmpl: TemplateRef<HTMLElement>

  @ContentChild(FloMediaPlayerPlayBtnControlContentTemplateDirective, { read: TemplateRef })
  readonly floMpPlayTmplContent: TemplateRef<HTMLButtonElement>

  @ContentChild(FloMediaPlayerPauseBtnControlTemplateDirective, { read: TemplateRef })
  readonly floMpPauseTmpl: TemplateRef<HTMLElement>

  @ContentChild(FloMediaPlayerPauseBtnControlContentTemplateDirective, { read: TemplateRef })
  readonly floMpPauseContentTmpl: TemplateRef<HTMLButtonElement>

  private observer?: MutationObserver

  ngOnInit() {
    this.cd.markForCheck()
    // tslint:disable-next-line: no-object-mutation
    // this.observer = new MutationObserver(records => {
    //   if (records.filter(b => b.type === 'attributes').find(b => b.attributeName === 'controls')) {
    //     this.cd.markForCheck()
    //   }
    // })
    // this.observer.observe(this.mediaRef, {
    //   childList: false,
    //   attributes: true,
    //   subtree: false
    // })
  }

  ngOnChanges(sc: SimpleChanges) {
    // this.cd.markForCheck()
    // if (sc.mediaRef.previousValue) {
    //   sc.mediaRef.previousValue.muted = true
    //   sc.mediaRef.currentValue.muted = false
    // }
  }

  ngOnDestroy() {
    if (this.observer) { this.observer.disconnect() }
  }
}
