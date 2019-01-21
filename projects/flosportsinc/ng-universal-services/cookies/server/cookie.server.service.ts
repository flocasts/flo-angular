import { EMPTY } from 'rxjs'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { ICookieService } from './cookie.interfaces'
import * as express from 'express'

@Injectable()
export class CookieServerService implements ICookieService {
  public readonly valueChange = EMPTY // noop on server
  public readonly valueChanges = EMPTY // noop on server

  constructor(@Inject(REQUEST) private req: express.Request) { }

  public readonly targetValueChange = () => EMPTY // noop on server

  public get(name: string): any {
    try {
      return JSON.parse(this.req.cookies[name])
    } catch (err) {
      return this.req ? this.req.cookies[name] : undefined
    }
  }

  public getAll(): any {
    return this.req && this.req.cookies
  }

  public readonly set = () => { } // noop on server
  public readonly remove = () => { } // noop on server
  public readonly updateSource = () => { } // noop on server
}
