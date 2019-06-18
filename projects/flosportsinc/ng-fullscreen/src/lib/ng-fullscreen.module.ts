import { NgModule } from '@angular/core'
import {
  FloFullscreenOnDirective, FloFullscreenOffDirective,
  FloClickToEnterFullscreenDirective, FloClickToExitFullscreenDirective
} from './ng-fullscreen.directive'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenComponent } from './ng-fullscreen.component'
import { CommonModule } from '@angular/common'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_CHANGE_EVENTS,
  FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FS_FULLSCREEN_ELEMENT, FS_FULLSCREEN_ENABLED
} from './ng-fullscreen.tokens'
import {
  DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS, DEFAULT_FS_FULLSCREEN_EXIT_EVENTS, DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS,
  DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, DEFAULT_FS_FULLSCREEN_ELEMENT, DEFAULT_FS_FULLSCREEN_ENABLED
} from './ng-fullscreen.tokens.defaults'

@NgModule({
  imports: [CommonModule],
  declarations: [
    FloFullscreenOnDirective,
    FloFullscreenOffDirective,
    FloClickToEnterFullscreenDirective,
    FloClickToExitFullscreenDirective,
    FloFullscreenComponent
  ],
  exports: [
    FloFullscreenOnDirective,
    FloFullscreenOffDirective,
    FloClickToEnterFullscreenDirective,
    FloClickToExitFullscreenDirective,
    FloFullscreenComponent
  ],
  providers: [
    FloFullscreenService,
    { provide: FS_FULLSCREEN_REQUEST_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS },
    { provide: FS_FULLSCREEN_EXIT_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_EXIT_EVENTS },
    { provide: FS_FULLSCREEN_CHANGE_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS },
    { provide: FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS },
    { provide: FS_FULLSCREEN_ELEMENT, useValue: DEFAULT_FS_FULLSCREEN_ELEMENT },
    { provide: FS_FULLSCREEN_ENABLED, useValue: DEFAULT_FS_FULLSCREEN_ENABLED }
  ]
})
export class FloFullscreenModule { }
