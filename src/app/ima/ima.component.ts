import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-ima',
  templateUrl: './ima.component.html',
  styleUrls: ['./ima.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImaComponent {
  // tslint:disable-next-line:max-line-length
  readonly adTag = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='
}
