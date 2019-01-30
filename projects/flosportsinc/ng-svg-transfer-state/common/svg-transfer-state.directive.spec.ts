import { TestBed } from '@angular/core/testing'
import { SvgTransferStateModule, DEFAULT_STYLES } from './svg-transfer-state.module'
import { SvgTransferStateDirective } from './svg-transfer-state.directive'
import { Component } from '@angular/core'
import { SVG_REQUEST_PATTERN_BASE, SVG_LOADER, SVG_DIRECTIVE_DEFAULT_STYLES } from './svg-transfer-state.tokens'
import { of } from 'rxjs'
import { By } from '@angular/platform-browser'

const sampleSvg = `<svg><circle cx="50" cy="50" r="40" /></svg> `

@Component({
  template: `<i floSvg="icon.svg"></i>`,
  selector: `flo-test-host-component`
})
class TestHostComponent { }

const setupTb = () => {
  TestBed.configureTestingModule({
    declarations: [TestHostComponent],
    imports: [SvgTransferStateModule],
    providers: [
      {
        provide: SVG_LOADER,
        useValue: {
          load: () => of(sampleSvg)
        }
      },
      {
        provide: SVG_REQUEST_PATTERN_BASE,
        useValue: '/root/path/test'
      },
      {
        provide: SVG_DIRECTIVE_DEFAULT_STYLES,
        useValue: {
          ...DEFAULT_STYLES,
          fill: 'green'
        }
      }
    ]
  })
}

describe(SvgTransferStateDirective.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should load SVG', () => {
    setupTb()

    const host = TestBed.createComponent(TestHostComponent)
    host.detectChanges()

    const nativeIElement = host.debugElement.query(By.directive(SvgTransferStateDirective)).nativeElement as HTMLDivElement
    const svg = nativeIElement.firstElementChild
    const innerSvg = svg && svg.innerHTML

    expect(innerSvg).toEqual('<circle cx="50" cy="50" r="40"></circle>')
  })

  it('should apply styles', () => {
    setupTb()

    const host = TestBed.createComponent(TestHostComponent)
    host.detectChanges()

    const nativeIElement = host.debugElement.query(By.directive(SvgTransferStateDirective)).nativeElement as HTMLDivElement
    const svgRoot = nativeIElement.firstElementChild as SVGElement

    expect(nativeIElement.style.height).toEqual(DEFAULT_STYLES.height)
    expect(nativeIElement.style.fill).not.toEqual('green')
    expect(svgRoot.style.fill).toEqual('green')
    expect(svgRoot.style.height).toEqual(DEFAULT_STYLES.height)
  })
})
