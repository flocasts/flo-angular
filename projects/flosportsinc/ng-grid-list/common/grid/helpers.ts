export const swapAtIndex =
  <T>(collection: ReadonlyArray<T>, idx1: number, val1?: T, idx2?: number, val2?: T) => {
    // tslint:disable-next-line: readonly-array
    const _cloned = [...collection]

    // tslint:disable-next-line: no-object-mutation
    _cloned[idx1] = val1 || collection[idx1]

    // tslint:disable-next-line: no-if-statement
    if (idx2) {
      // tslint:disable-next-line: no-object-mutation
      _cloned[idx2] = val2 || collection[idx2]
    }

    return _cloned
  }


export const swapItemsViaIndices =
  <T>(collection: ReadonlyArray<T>, idx1: number, idx2: number) => {
    // tslint:disable-next-line: readonly-array
    const _cloned = [...collection]

    // tslint:disable-next-line: no-object-mutation
    _cloned[idx1] = collection[idx2]

    // tslint:disable-next-line: no-object-mutation
    _cloned[idx2] = collection[idx1]

    return _cloned
  }

export const fillWith = (num: number, str: string) => new Array<string>(num).fill(str).reduce((acc, curr) => acc + curr, '').trimRight()

export const chunk = <T>(size: number, collection: ReadonlyArray<T> = []) =>
  collection.reduce((acc, _, index) =>
    index % size === 0
      ? [...acc, collection.slice(index, index + size)]
      : acc, [])
