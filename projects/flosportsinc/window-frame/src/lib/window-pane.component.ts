import {
  Component, ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'flo-window-pane',
  styles: [`
    :host {
      overflow: hidden;
      height: 0;
      padding-top: 56.25%;
      position: relative;
    }
  `],
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowPaneComponent {

}
