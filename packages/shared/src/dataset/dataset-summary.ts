import { ReferenceSummary } from './reference-summary'

export interface DatasetSummary {
  readonly lastChecked: string
  readonly lastUpdated: string
  readonly mainDataHash: string
  readonly mainDataPath: string
  readonly referenceSummary: ReferenceSummary
}
