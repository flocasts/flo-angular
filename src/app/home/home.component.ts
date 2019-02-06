import { Component, ChangeDetectionStrategy, Inject } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  constructor() {
    // import('//imasdk.googleapis.com/js/sdkloader/ima3.js').then(console.log)
  }
}
