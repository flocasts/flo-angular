export const swapAtIndex =
  <T>(collection: ReadonlyArray<T>, idx: number, value: T) =>
    [...collection.slice(0, idx), value, ...collection.slice(idx + 1)]

export const fillWith = (num: number, str: string) => new Array<string>(num).fill(str).reduce((acc, curr) => acc + curr, '').trimRight()

export const chunk = <T>(size: number, collection: ReadonlyArray<T> = []) =>
  collection.reduce((acc, _, index) =>
    index % size === 0
      ? [...acc, collection.slice(index, index + size)]
      : acc, [])
