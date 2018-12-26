import { maybe } from 'typescript-monads'
import { PROJECTS } from './libs'
import { exec } from 'shelljs'
import { resolve } from 'path'
import { readFileSync, writeFile } from 'fs'

maybe(process.argv.find(a => a.includes('ver=')))
  .map(a => a.replace('ver=', ''))
  .tapSome(version => {
    PROJECTS
      .map(proj => resolve(proj.replace('@', 'dist/')))
      .forEach(path => {
        try {
          const packagePath = resolve(path, 'package.json')
          const file = JSON.parse(readFileSync(packagePath, 'utf-8').toString()) as any
          const newFile = {
            ...file,
            version
          }
          writeFile(packagePath, JSON.stringify(newFile, undefined, 2), err => {
            maybe(err)
              .tap({
                some: e => {
                  throw e
                },
                none: () => {
                  exec(`npm publish ${path} --access=public`)
                }
              })
          })
        } catch (err) {
          console.error(err)
          process.exit(1)
        }
      })
  })


