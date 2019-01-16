import * as config from '../tsconfig.json'
import { Icon } from '../projects/flosportsinc/ng-icons/src/lib/icons'

const notIncludes = (searchString: string) => (a: string) => !a.includes(searchString)

export const PROJECTS = Object.keys(config.compilerOptions.paths).filter(notIncludes('/*'))

const FONT_AWESOME_TO_EXTRACT = Object.keys(Icon)
  .filter(a => a.includes('FA_'))
  .map(a => Icon[a])

export const PROJECT_ASSET_COPY_DICT = {
  [`node_modules/@fortawesome/fontawesome-free/svgs/**/*(${FONT_AWESOME_TO_EXTRACT.join('|')}).*`]: 'dist/flosportsinc/ng-icons/svg',
  'projects/flosportsinc/ng-icons/src/lib/svg/**/*.*': 'dist/flosportsinc/ng-icons/svg'
}
