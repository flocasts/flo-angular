import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  private readonly _pkgs: ReadonlyArray<any> = [
    'ng-svg-transfer-state',
    'ng-ad-block',
    'ng-http-cache-tags',
    'ng-media-source-externsion'
  ]

  constructor(private ar: ActivatedRoute) { }

  public readonly view$ = this.ar.url.pipe(
    map(urlSegments => {
      const seg = urlSegments.pop()
      return {
        showReadme: this._pkgs.includes(seg && seg.path),
        readmeLink: `/assets/md/${seg}/README.md`.replace('/projects/flosportsinc', '')
      }
    })
  )
}
