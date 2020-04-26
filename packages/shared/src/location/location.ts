import { Geography } from './geography'

export interface Location {
  readonly code: string
  readonly name: string
  readonly geography?: Geography
}
