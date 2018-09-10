import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const createCommand = (str: string) => `node_modules/.bin/ng build ${str}`;

const tsconfig = readFileSync('tsconfig.json');
const tsconfigObject = JSON.parse(tsconfig.toString());
const libraries = Object.keys(tsconfigObject.compilerOptions.paths).filter(a => !a.includes('/*'));
const printMessage = (refs: string[]) => console.log('\nBUILDING LIBRARIES\n', refs.map(a => `  ${a}`).join('\n'), '\n');

printMessage(libraries);

libraries
  .map(createCommand)
  .forEach(commandPath => {
    console.log(execSync(commandPath, {}).toString());
  });
