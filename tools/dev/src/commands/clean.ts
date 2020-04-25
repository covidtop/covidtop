import { createBinary } from '../binaries'

const rimraf = createBinary('rimraf')

export const clean = (argv: string[]): Promise<number> => rimraf('lib', 'coverage', 'package-lock.json', ...argv)
