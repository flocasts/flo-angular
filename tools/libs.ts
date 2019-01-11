import * as config from '../tsconfig.json'

const notIncludes = (searchString: string) => (a: string) => !a.includes(searchString)

export const PROJECTS = Object.keys(config.compilerOptions.paths).filter(notIncludes('/*'))

export const PROJECT_ASSET_COPY_DICT = {
  'projects/flosportsinc/ng-icons/src/lib/svg/**/*.*': 'dist/flosportsinc/ng-icons/svg'
}
