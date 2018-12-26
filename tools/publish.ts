import { maybe } from 'typescript-monads'
import { exec } from 'shelljs'
import { PROJECTS } from './libs'
import { resolve } from 'path'
import { readFile, writeFile } from 'fs'
import { bindNodeCallback, forkJoin, EMPTY } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

const readFile_ = (path: string) => bindNodeCallback(readFile)(path)
const writeFile_ = (path: string) => (data: string) => bindNodeCallback(writeFile)(path, data)
const findVer = (a: string) => a.includes('ver=')
const cleanVer = (a: string) => a.replace('ver=', '')
const resolvePackageJson = (path: string) => resolve(path, 'package.json')
const execNpmPublish = (path: string) => exec(`npm publish ${path} --access=public`)
const execNpmPublisCollection = (paths: ReadonlyArray<string>) => paths.forEach(execNpmPublish)

const mapToProjectObject =
  (path: string) => ({ path, packagePath: resolvePackageJson(path) })

const mapToVerPack =
  (projectPaths: ReadonlyArray<string>) =>
    (version: string) =>
      ({ version, projects: projectPaths.map(mapToProjectObject) })

const pPaths = PROJECTS.map(proj => resolve(proj.replace('@', 'dist/')))

const catchError = (err: any) => {
  console.error(err)
  process.exit(1)
}

maybe(process.argv.find(findVer))
  .map(cleanVer)
  .map(mapToVerPack(pPaths))
  .map(a => a.projects.map(proj => readFile_(proj.packagePath).pipe(
    map(buffer => JSON.parse(buffer.toString())),
    map(file => ({ ...proj, file, version: a.version })),
    flatMap(res => writeFile_(res.packagePath)(JSON.stringify({ ...res.file, version: res.version }, undefined, 2)).pipe(
      map(() => res.path)
    ))
  )))
  .map(a => forkJoin(a))
  .valueOr(EMPTY)
  .subscribe(execNpmPublisCollection, catchError)
