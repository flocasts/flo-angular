import { EMPTY } from 'rxjs'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { ICookieService } from './cookie.interfaces'
import { Request } from 'express'

@Injectable()
export class CookieServerService implements ICookieService {
  constructor(@Inject(REQUEST) private req: Request) { }

  public readonly get = <T>(name: string): T => this.req.cookies[name] as T
  public readonly getAll = () => this.req.cookies
  public readonly valueChange = EMPTY // noop on server
  public readonly valueChanges = EMPTY // noop on server
  public readonly targetValueChange = () => EMPTY // noop on server
  public readonly set = () => { } // noop on server
  public readonly remove = () => { } // noop on server
}
