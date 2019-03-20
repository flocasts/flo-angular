import { Injectable } from '@angular/core'
import { IMaybe, maybe } from 'typescript-monads'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { share, map, flatMap, switchMap } from 'rxjs/operators'

export interface IFloViewportManagerService<T> {
  readonly items$: Observable<ReadonlyArray<IMaybe<T>>>
  readonly add: (item?: T) => void
  readonly set: (item?: T, index?: number) => void
  readonly remove: (index: number) => void
  readonly setVisible: (num: number) => void
  readonly removeValueByIndex: (index?: number) => void
  readonly removeValueByPredicate: (fn: (item?: T) => boolean) => void
  readonly swap: () => void
  readonly reset: () => void
}

@Injectable()
export class FloViewportManagerService<T = any> implements IFloViewportManagerService<T> {
  private readonly items = new BehaviorSubject<ReadonlyArray<IMaybe<T>>>([])
  private readonly visible = new BehaviorSubject<number>(0)
  private readonly getItems = () => this.items.getValue()

  readonly items$ = this.items.pipe(share())
  readonly viewItems$ = this.visible.pipe(
    flatMap(num => this.items.pipe(map(items => items.slice(0, num))))
  )

  readonly setVisible = (num: number) => {
    // if num is above current list size, fill in with empties
    const items = this.getItems()
    const currentCount = items.length
    const numToFill = num > currentCount ? num - currentCount : 0
    this.items.next([...this.getItems(), ...Array.from(Array(numToFill).keys()).map(_ => maybe<T>())])
    this.visible.next(num)
  }

  readonly add = (item?: T) => this.items.next([...this.getItems(), maybe(item)])

  readonly set = (item?: T, index?: number) => {
    const current = this.getItems()
    const idx = maybe(index).valueOr(current.length + 1)

    const leftPortion = current.slice(0, idx)
    const rightPortion = current.slice(idx + 1, current.length)

    this.items.next([...leftPortion, maybe(item), ...rightPortion])
  }

  readonly swap = () => {
    throw new Error('NotImplemented')
  }

  readonly remove = () => {
    throw new Error('NotImplemented')
  }

  readonly reset = () => this.items.next([])

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
