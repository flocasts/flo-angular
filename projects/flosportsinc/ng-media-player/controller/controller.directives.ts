import { Directive, ElementRef } from '@angular/core'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export abstract class FloMediaPlayerPlayControlTemplateDirective {
  constructor(public elm: ElementRef<HTMLElement>) { }
}

@Directive({ selector: '[floMpPlayControlTmpl]' })
export class FloMediaPlayerPlayBtnControlTemplateDirective extends FloMediaPlayerPlayControlTemplateDirective { }

@Directive({ selector: '[floMpPlayControlContentTmpl]' })
export class FloMediaPlayerPlayBtnControlContentTemplateDirective extends FloMediaPlayerPlayControlTemplateDirective { }


// @Directive({
//   selector: '[floMpPause]',
// })
// export class FloVideoPlayerPauseControlTemplateDirective {
//   constructor(public elm: ElementRef<HTMLElement>) { }
// }
