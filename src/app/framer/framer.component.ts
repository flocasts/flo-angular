import { Component, ChangeDetectionStrategy, ContentChildren, ElementRef, Directive, ViewChildren, QueryList } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { ICompConfigForm } from './framer.interface'
import { ViewportGridBoxComponent } from '@flosportsinc/viewport-grid'

const DEFAULT_MAX_HEIGHT = 600
const DEFAULT_ELEMENT_COUNT = 4
const DEFAULT_VIDEO_SOURCE_URL = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4'

const objectsAreEqual = (a: any) => (b: any) => JSON.stringify(a) === JSON.stringify(b)
const mapFromForm = (input: ICompConfigForm) => {
  return {
    maxHeight: input.maxHeight,
    videos: Array(input.elementCount).fill(0).map((_, id) => {
      return {
        id,
        src: input.videoSource
      }
    })
  }
}

@Directive({
  selector: '[appSimpleTest]'
})
export class AppSimpleTestDirective {
  constructor(public elementRef: ElementRef<AppSimpleTestDirective>) { }
}

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FramerComponent {
  @ViewChildren(AppSimpleTestDirective) readonly appTest: QueryList<AppSimpleTestDirective>

  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(DEFAULT_MAX_HEIGHT, [Validators.required]),
    elementCount: new FormControl(DEFAULT_ELEMENT_COUNT, [Validators.required]),
    videoSource: new FormControl(DEFAULT_VIDEO_SOURCE_URL, [Validators.required])
  })

  readonly view_ = this.formGroup.valueChanges.pipe(
    distinctUntilChanged((a, b) => objectsAreEqual(a)(b)),
    startWith(this.formGroup.value),
    map<ICompConfigForm, any>(mapFromForm)
  )

  readonly trackByVideoId = (_: number, item: any) => item.id

  test(d: ViewportGridBoxComponent<HTMLVideoElement>) {
    d.maybePanelItemElement().tapSome(vid => {
      // console.log(this.appTest.toArray().map(a => a.nativeElement)[0])
      // const c = this.appTest.toArray().map(s => s.nativeElement) as ReadonlyArray<HTMLDivElement>
      const instances = this.appTest.toArray().filter((a: any) => a.elementRef.nativeElement === vid)
      console.log(instances)
      // console.log(this.appTest.toArray().map(s => s.nativeElement).find(a => a === vid))
    })
  }
}
