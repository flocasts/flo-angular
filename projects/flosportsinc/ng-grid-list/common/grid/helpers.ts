export const swapItemsViaIndices =
  <T>(collection: ReadonlyArray<T>, idx1: number, idx2: number) => {
    if (!collection.length) { return [] }

    // tslint:disable-next-line: readonly-array
    const _cloned = [...collection]

    // tslint:disable-next-line: no-object-mutation
    _cloned[idx1] = collection[idx2]

    // tslint:disable-next-line: no-object-mutation
    _cloned[idx2] = collection[idx1]

    return _cloned
  }
