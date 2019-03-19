import { Injectable } from '@angular/core'
import { IMaybe, maybe } from 'typescript-monads'
import { BehaviorSubject, Observable } from 'rxjs'

export interface IFloViewportManagerService<T> {
  readonly items$: Observable<ReadonlyArray<IMaybe<T>>>
  readonly showCount: (num: number) => void
  readonly add: (item?: T) => void
  readonly set: (item?: T, index?: number) => void
  readonly removeValueByIndex: (index?: number) => void
  readonly removeValueByPredicate: (fn: (item?: T) => boolean) => void
  readonly swap: () => void
}

@Injectable()
export class FloViewportManagerService<T> implements IFloViewportManagerService<T> {
  private readonly items = new BehaviorSubject<ReadonlyArray<IMaybe<T>>>([])
  private readonly viewItems = new BehaviorSubject<ReadonlyArray<IMaybe<T>>>([])
  private readonly getItems = () => this.items.getValue()

  readonly items$ = this.items.asObservable()
  readonly viewItems$ = this.viewItems.asObservable()
  readonly showCount = (num: number) => this.viewItems.next(this.getItems().slice(0, num))
  readonly add = (item?: T) => this.items.next([...this.getItems(), maybe(item)])

  readonly set = (item?: T, index?: number) => {
    const current = this.getItems()
    const idx = maybe(index).valueOr(current.length + 1)

    const leftPortion = current.slice(0, idx)
    const rightPortion = current.slice(idx + 1, current.length)

    this.items.next([...leftPortion, maybe(item), ...rightPortion])
  }

  readonly swap = () => {
    throw new Error('Not Implemented')
  }

  readonly removeValueByIndex = (index: number) => {
    const items = this.getItems()
    const isInvalidIndex = () => isNaN(index) || index < 0 || index + 1 > items.length

    // tslint:disable-next-line:no-if-statement
    if (isInvalidIndex()) { return }

    const filtered: ReadonlyArray<any> = [...items.slice(0, index), maybe<T>(), ...items.slice(index + 1, items.length)]

    this.items.next(filtered)
  }

  readonly removeValueByPredicate =
    (fn: (item?: T) => boolean) =>
      this.items.next(this.getItems().map(a => fn(a.valueOrUndefined()) ? maybe<T>() : a))
}
