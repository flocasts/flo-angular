import { Component, ChangeDetectionStrategy, Inject } from '@angular/core'
import { PwaService } from './pwa.service'
import { COOKIE_SERVICE, ICookieService } from '@flosportsinc/ng-universal-services/cookies'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(_pwa: PwaService, @Inject(COOKIE_SERVICE) cs: ICookieService) {
    cs.set('test', 1)
    cs.set('test2', {
      thing: 10
    })
    console.log(cs.getAll())
    console.log(cs.get('test2'))
  }
}
