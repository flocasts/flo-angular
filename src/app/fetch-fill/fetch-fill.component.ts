import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-fetch-fill',
  templateUrl: './fetch-fill.component.html',
  styleUrls: ['./fetch-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FetchFillComponent  {
  // tslint:disable: readonly-array
  // tslint:disable: readonly-keyword
  eventIds: string[] = ['9684']

  add() {
    this.eventIds.push('9428')
  }
}
