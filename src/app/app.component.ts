import { Component, ChangeDetectionStrategy, Inject } from '@angular/core'
import { PwaService } from './pwa.service'
import { ENV } from '@flosportsinc/ng-env-transfer-state'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(_pwa: PwaService, @Inject(ENV) public env: any) {
    console.log(env)
  }
}
