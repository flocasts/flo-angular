import { exec } from 'child_process'
import { PROJECTS } from './libs'
import { bindNodeCallback, forkJoin } from 'rxjs'

const createCommand = (str: string) => `node_modules/.bin/ng build ${str}`
const printMessage = (refs: ReadonlyArray<string>) => {
  console.log('\nBUILDING LIBRARIES')
  console.log(refs.map(a => `   ${a}`).join('\n'), '\n')
}

printMessage(PROJECTS)

const obs = PROJECTS
  .map(createCommand)
  .map(commandPath => bindNodeCallback(exec)(commandPath))

forkJoin(obs)
  .subscribe(res => {
    console.log('Libraries Built!')
  }, err => {
    console.error(err)
    process.exit(1)
  })
