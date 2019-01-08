import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { async, TestBed } from '@angular/core/testing'

// describe(HttpXCacheInterceptor.name, () => {
//   let interceptor: HttpInterceptor

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [AppTestingModule.forRoot()],
//       providers: [
//         HttpXCacheInterceptor,
//         { provide: HttpHandler, useValue: new MockHttpHandler() },
//         {
//           provide: ServerResponseService,
//           useValue: new MockServerResponseService()
//         }
//       ]
//     })
//   })

//   beforeEach(() => {
//     interceptor = TestBed.get(HttpXCacheInterceptor)
//   })

//   afterEach(() => {
//     TestBed.resetTestingModule()
//   })

//   it('should construct', async(() => {
//     expect(interceptor).toBeDefined()
//   }))

//   it('should append cache headers when GET response status code is 200 and header exists', async(() => {
//     const req = new HttpRequest('GET', 'articles')
//     const handler = TestBed.get(HttpHandler) as HttpHandler
//     const spy = jest.spyOn(
//       TestBed.get(ServerResponseService) as IServerResponseService,
//       'appendHeader'
//     )
//     interceptor.intercept(req, handler).subscribe(next => {
//       expect(spy).toHaveBeenCalledTimes(1)
//     })
//   }))

//   it('should not append cache headers when wrong header exists', async(() => {
//     const req = new HttpRequest('GET', 'articles')
//     const handler = TestBed.get(HttpHandler) as MockHttpHandler
//     handler.headers = { 'X-Cache-Wrong-Key': 'Article-123' }
//     const spy = jest.spyOn(
//       TestBed.get(ServerResponseService) as IServerResponseService,
//       'appendHeader'
//     )
//     interceptor.intercept(req, handler as any).subscribe(next => {
//       expect(spy).not.toHaveBeenCalled()
//     })
//   }))

//   it('should not append cache headers when no headers exists', async(() => {
//     const req = new HttpRequest('GET', 'articles')
//     const handler = TestBed.get(HttpHandler) as MockHttpHandler
//     handler.headers = undefined
//     const spy = jest.spyOn(
//       TestBed.get(ServerResponseService) as IServerResponseService,
//       'appendHeader'
//     )
//     interceptor.intercept(req, handler as any).subscribe(next => {
//       expect(spy).not.toHaveBeenCalled()
//     })
//   }))

//   it('should not append during http status codes other than 200', async(() => {
//     const req = new HttpRequest('GET', 'articles')
//     const handler = TestBed.get(HttpHandler) as MockHttpHandler
//     handler.status = 400
//     const spy = jest.spyOn(
//       TestBed.get(ServerResponseService) as IServerResponseService,
//       'appendHeader'
//     )
//     interceptor.intercept(req, handler as any).subscribe(next => {
//       expect(spy).not.toHaveBeenCalled()
//     })
//   }))
// })

// class MockHttpHandler {
//   headers: { [key: string]: string } | undefined = {
//     'X-Cache-Tags': 'Article-123'
//   }
//   status = 200
//   handle(obs: Observable<any>) {
//     return of(
//       new HttpResponse({
//         status: this.status,
//         headers: new HttpHeaders(this.headers)
//       })
//     )
//   }
// }

// class MockServerResponseService implements IServerResponseService {
//   returnJson(obj: any): void {
//     throw new Error('Method not implemented.')
//   }
//   setRedirect(location: string): this {
//     throw new Error('Method not implemented.')
//   }
//   removeHeader(key: string): this {
//     throw new Error('Method not implemented.')
//   }
//   appendHeader(
//     key: string,
//     value: string,
//     delimiter?: string | undefined
//   ): this {
//     return this
//   }
//   getHeader(key: string): string {
//     throw new Error('Method not implemented.')
//   }
//   setHeader(key: string, value: string): this {
//     return this
//   }
//   setHeaders(dictionary: { [key: string]: string }): this {
//     throw new Error('Method not implemented.')
//   }
//   setStatus(code: number, message?: string | undefined): this {
//     throw new Error('Method not implemented.')
//   }
//   setNotFound(message?: string | undefined): this {
//     throw new Error('Method not implemented.')
//   }
//   setError(message?: string | undefined): this {
//     throw new Error('Method not implemented.')
//   }
// }
