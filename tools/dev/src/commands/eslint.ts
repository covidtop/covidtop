import { createBinary } from '../binaries'

const runEslint = createBinary('eslint')

// TODO enable @typescript-eslint/unbound-method when https://github.com/typescript-eslint/typescript-eslint/pull/1736 is merged
// TODO review/simplify "extends", feel like standard is not required anymore
export const eslint = (argv: string[]): Promise<number> => {
  return runEslint('--config', 'eslint.json', '--ignore-pattern', '/lib/', '--fix', '--ext', '.ts,.tsx', ...argv)
}
