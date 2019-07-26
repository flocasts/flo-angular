import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-fetch-fill',
  templateUrl: './fetch-fill.component.html',
  styleUrls: ['./fetch-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FetchFillComponent  {

  readonly items: ReadonlyArray<any> = [
    { id: 1, name: 'test stream' },
    { id: 2, name: 'another stream' }
  ]
}
