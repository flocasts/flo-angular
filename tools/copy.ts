import { bindNodeCallback, forkJoin, EMPTY, of, bindCallback } from 'rxjs'
import { writeFile, readFile, mkdir } from 'fs'
import { flatMap, take, catchError, tap } from 'rxjs/operators'
import { PROJECT_ASSET_COPY_DICT } from './libs'
import { resolve } from 'path'
import * as glob from 'glob'

const glob_ = bindNodeCallback<string, ReadonlyArray<string>>(glob)
const mkdir_ = (path: string) => bindNodeCallback(mkdir)(path)
const readFile_ = (path: string) => bindNodeCallback(readFile)(path)
const writeFile_ = (path: string) => (file: string | Buffer) => bindNodeCallback(writeFile)(path, file)
const copyFile_ =
  (fromPath: string) =>
    (toPath: string) =>
      readFile_(fromPath)
        .pipe(flatMap(writeFile_(toPath)))

const runCopy = Object.keys(PROJECT_ASSET_COPY_DICT)
  .map(a => glob_(a)
    .pipe(
      flatMap(b => forkJoin(b.map(c => {
        const dir = resolve(PROJECT_ASSET_COPY_DICT[a])
        const outFile = resolve(dir, c.split('/').pop() || '')
        const inFile = resolve(c)
        const obs = copyFile_(inFile)(outFile)
        return mkdir_(dir).pipe(
          catchError(_ => obs),
          flatMap(_ => obs)
        )
      })))
    ))

forkJoin(runCopy)
  .pipe(take(1))
  .subscribe()
