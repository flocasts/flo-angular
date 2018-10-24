import * as config from '../tsconfig.json'

const notIncludes = (searchString: string) => (a: string) => !a.includes(searchString)

export const PROJECTS = Object.keys(config.compilerOptions.paths).filter(notIncludes('/*'))
