import { createBinary } from '../binaries'

const lerna = createBinary('lerna')

export const add = (argv: string[]): Promise<number> => lerna('add', ...argv, '--no-bootstrap', '--exact')
