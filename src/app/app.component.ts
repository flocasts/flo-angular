import { Component, ChangeDetectionStrategy } from '@angular/core'
import { PwaService } from './pwa.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(_pwa: PwaService) { }
}
