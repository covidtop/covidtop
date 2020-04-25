import { createBinary } from '../binaries'

const lerna = createBinary('lerna')

export const run = (argv: string[]): Promise<number> => lerna('run', ...argv)
