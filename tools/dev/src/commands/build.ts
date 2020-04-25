import { createBinary } from '../binaries'

const tsc = createBinary('tsc')

export const build = (argv: string[]): Promise<number> => tsc(...argv)
