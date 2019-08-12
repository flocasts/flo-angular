import { NgModule, PLATFORM_ID } from '@angular/core'
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http'
import { LOADERS, ILoaderFactory, StringDict } from './ng-fetch-fill.tokens'
import { CommonModule, isPlatformServer } from '@angular/common'
import { of, Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { ok, fail, IResult } from 'typescript-monads'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'
import { FloFetchFillDirective } from './ng-fetch-fill.directive'

interface GeoIPResponseItem {
  readonly id: number
  readonly statusCode: number
  readonly message: string
}
interface GeoIPResponse {
  readonly data: ReadonlyArray<GeoIPResponseItem>
}

type GeoIPResponseItemResultSide = StringDict<GeoIPResponseItem, string>
type GeoIPResponseItemResult = IResult<StringDict<GeoIPResponseItem, string>, string>

export function geoip(http: HttpClient, platformId: string): ILoaderFactory {
  const lambda = (items: ReadonlyArray<string>): Observable<GeoIPResponseItemResult> =>
    isPlatformServer(platformId)
      ? of(fail<GeoIPResponseItemResultSide, string>('OK'))
      : http.get<GeoIPResponse>(`https://staging-live-api-3.flosports.tv/events/geo?eventIds=${items}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer' })
      }).pipe(
        map(res => {
          return res.data.reduce((acc, geoResponseItem) => {
            return {
              ...acc,
              [`${geoResponseItem.id}`]: geoResponseItem.statusCode === 451
                ? ok(geoResponseItem)
                : fail<GeoIPResponseItem, string>('OK')
            }
          }, {} as GeoIPResponseItemResultSide)
        }),
        map(ok),
        catchError(err => of(fail<GeoIPResponseItemResultSide, string>(err))))
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
      deps: [HttpClient, PLATFORM_ID]
    }
  ]
})
export class FloFetchFillModule { }
