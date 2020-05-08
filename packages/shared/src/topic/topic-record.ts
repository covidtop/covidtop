export interface TopicRecord {
  // array of location codes by the order of `locationGroups`
  readonly locationCodePerType: string[]
  // array of measures by the order of `measureTypes` and `dates`
  readonly measurePerTypeAndDate: number[][]
}
