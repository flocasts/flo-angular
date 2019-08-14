import { NgModule, PLATFORM_ID } from '@angular/core'
import {
  FloFetchFillModule,
  LOADERS,
  StringDict,
  ILoaderFactory
} from '@flosportsinc/ng-fetch-fill'
import { IResult, ok, fail } from 'typescript-monads'
import { map, catchError } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-live-geo-ip',
  template: `
    <span>Unavailable in your area</span>
    <i floSvg="exclamation-circle"></i>
  `
})
export class SampleFetchComponent {
  @Input() readonly response: any
}

export function sample(): ILoaderFactory {
  const sampleData = { 123: 'test123', 456: 'test456' }
  const lambda = (items: ReadonlyArray<string>) => {
    return of(ok(items.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: sampleData[curr] ? ok(sampleData[curr]) : fail(sampleData[curr])
      }
    }, {} as StringDict<any, any>)))
  }
  return {
    key: 'geo',
    func: lambda
  }
}

@NgModule({
  imports: [FloFetchFillModule],
  declarations: [SampleFetchComponent],
  exports: [FloFetchFillModule, SampleFetchComponent],
  providers: [
    { multi: true, provide: LOADERS, useFactory: sample }
  ]
})
export class SamlpeFetchFillModule {}
