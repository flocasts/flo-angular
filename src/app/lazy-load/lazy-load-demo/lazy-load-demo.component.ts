import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core'

@Component({
  selector: 'app-lazy-load-demo',
  templateUrl: './lazy-load-demo.component.html',
  styleUrls: ['./lazy-load-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyLoadDemoComponent {
  @Input() public show = false
}
