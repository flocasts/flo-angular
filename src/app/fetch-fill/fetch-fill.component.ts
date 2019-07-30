import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-fetch-fill',
  templateUrl: './fetch-fill.component.html',
  styleUrls: ['./fetch-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FetchFillComponent  {
  readonly eventIds: ReadonlyArray<any> = ['9684', '9428']
}
