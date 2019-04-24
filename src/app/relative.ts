import { Observable, bindNodeCallback, scheduled, asapScheduler } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import { readFile } from 'fs'
import { SOME_TOKEN } from './tokens'

@Injectable()
export class HttpRelativeInterceptor implements HttpInterceptor {
  constructor(@Inject(SOME_TOKEN) private token: string) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.url.includes('http')
      ? next.handle(req)
      : bindNodeCallback(readFile)(this.token + req.url).pipe(
        map(a => {
          return new HttpResponse<any>({
            body: a.toString(),
            status: 200,
            url: req.url
          })
        }),
        catchError(_ => {
          return scheduled([new HttpResponse<any>({
            status: 404,
            statusText: 'Not found',
            url: req.url
          })], asapScheduler)
        })
      )
  }
}
