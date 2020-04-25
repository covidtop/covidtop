import { createBinary } from '../binaries'

const runPrettier = createBinary('prettier')

export const prettier = (argv: string[]): Promise<number> => {
  return runPrettier('--loglevel', 'warn', '--write', ...argv)
}
