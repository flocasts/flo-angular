import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Icon } from '@flosportsinc/ng-icons'

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsComponent {
  public readonly icons = Object.keys(Icon).map(a => {
    return {
      enumKey: a,
      locKey: Icon[a]
    }
  })

  trackBy(_index: number, item: string) {
    return item
  }
}
