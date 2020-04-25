import { SpawnOptions } from 'child_process'
import spawn from 'cross-spawn'
import path from 'path'

const globalCommands = ['npm', 'docker']

type BinaryWithOptions = (argv: string[], options?: SpawnOptions) => Promise<number>

export const createBinaryWithOptions = (command: string): BinaryWithOptions => {
  const fullCommand = globalCommands.includes(command) ? command : path.join(__dirname, '../node_modules/.bin', command)
  return (argv: string[], options?: SpawnOptions): Promise<number> => {
    console.log(`> ${command} ${argv.map((arg) => `'${arg}'`).join(' ')}`)
    return new Promise<number>((resolve, reject) => {
      spawn(fullCommand, argv, { stdio: ['pipe', process.stdout, process.stderr], ...options })
        .on('close', resolve)
        .on('error', reject)
    })
  }
}

type Binary = (...argv: string[]) => Promise<number>

export const createBinary = (command: string): Binary => {
  const binary = createBinaryWithOptions(command)
  // Run binary with no extra options
  return (...argv: string[]): Promise<number> => binary(argv)
}
