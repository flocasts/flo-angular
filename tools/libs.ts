import * as config from '../tsconfig.json'

const notIncludes = (searchString: string) => (a: string) => !a.includes(searchString)

export const PROJECTS = Object.keys(config.compilerOptions.paths).filter(notIncludes('/*'))

const FONT_AWESOME_TO_EXTRACT: ReadonlyArray<any> = [
  'check',
  'minus',
  'search',
  'times',
  'cc-amex',
  'cc-visa',
  'cc-discovery',
  'cc-mastercard'
]

export const PROJECT_ASSET_COPY_DICT = {
  [`node_modules/@fortawesome/fontawesome-free/svgs/**/*(${FONT_AWESOME_TO_EXTRACT.join('|')}).*`]: 'dist/flosportsinc/ng-icons/svg',
  'projects/flosportsinc/ng-icons/src/lib/svg/**/*.*': 'dist/flosportsinc/ng-icons/svg'
}
