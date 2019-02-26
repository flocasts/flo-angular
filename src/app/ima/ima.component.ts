import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-ima',
  templateUrl: './ima.component.html',
  styleUrls: ['./ima.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImaComponent {
  // tslint:disable-next-line:max-line-length
  readonly adTag = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator='
}
