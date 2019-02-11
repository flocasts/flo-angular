import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylesComponent { }
