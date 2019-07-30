import { NgModule } from '@angular/core'
import { FloFetchFillDirective, FloFetchFillItemDirective } from './ng-fetch-fill.directive'
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http'
import { LOADERS, ILoaderFactory } from './ng-fetch-fill.tokens'
import { CommonModule } from '@angular/common'
import { of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { ok, fail } from 'typescript-monads'

interface GeoIPResponseItem {
  readonly id: number
  readonly statusCode: number
  readonly message: string
}
interface GeoIPResponse {
  readonly data: ReadonlyArray<GeoIPResponseItem>
}

export function geoip(http: HttpClient): ILoaderFactory {
  const lambda = (ids: ReadonlyArray<string>) =>
    http.get<GeoIPResponse>(`https://staging-live-api-3.flosports.tv/events/geo?eventIds=${ids}`, {
    headers: new HttpHeaders({ Authorization: 'Bearer' })
  }).pipe(
    map(res => {
      return res.data.reduce((acc, geoResponseItem) => {
        return {
          ...acc,
          [`${geoResponseItem.id}`]: geoResponseItem.statusCode === 451 ? ok(geoResponseItem) : fail(geoResponseItem)
        }
      }, {})
    }),
    catchError(_err => of({}))
  ) as any

  return {
    key: 'geo',
    func: lambda
  }
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    FloFetchFillDirective,
    FloFetchFillItemDirective
  ],
  exports: [
    FloFetchFillDirective,
    FloFetchFillItemDirective
  ],
  providers: [
    {
      provide: LOADERS,
      useFactory: geoip,
      multi: true,
      deps: [HttpClient]
    }
  ]
})
export class FloFetchFillModule { }
