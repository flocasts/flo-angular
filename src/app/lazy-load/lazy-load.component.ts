import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core'

@Component({
  selector: 'app-lazy-load',
  templateUrl: './lazy-load.component.html',
  styleUrls: ['./lazy-load.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyLoadComponent {}
