import { execSync } from 'child_process'
import { PROJECTS } from './libs'

const createCommand = (str: string) => `node_modules/.bin/ng build ${str}`
const printMessage = (refs: ReadonlyArray<string>) => {
  console.log('\nBUILDING LIBRARIES')
  console.log(refs.map(a => `   ${a}`).join('\n'), '\n')
}

printMessage(PROJECTS)

PROJECTS
  .map(createCommand)
  .forEach(commandPath => {
    console.log(execSync(commandPath, {}).toString())
  })
