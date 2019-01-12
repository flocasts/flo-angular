import { Component, ChangeDetectionStrategy } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-universal-services/src/node-env-transfer'

interface D {
  readonly friend: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor(private ns: NodeEnvTransferService<D>) {
    console.log(ns.env)
  }

  readonly thing = this.ns.env
}
