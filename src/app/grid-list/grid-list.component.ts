import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridListComponent {
  // tslint:disable-next-line: readonly-keyword
  public items: ReadonlyArray<any> = [
    { id: '123', prop: '123' } as any,
    { id: '456', prop: '456' },
    { id: '789', prop: '789' },
    { id: '000', prop: '000' }
  ]
}
