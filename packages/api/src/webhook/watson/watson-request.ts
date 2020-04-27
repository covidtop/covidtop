import { WatsonRawEntity } from './watson-raw-entity'

export interface WatsonRequest {
  readonly type?: string
  readonly metrics?: string[]
  readonly locations?: WatsonRawEntity[]
  readonly breakdownLevel?: string
}
