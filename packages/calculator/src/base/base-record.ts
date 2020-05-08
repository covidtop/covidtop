export interface BaseRecord {
  readonly locationCode: string
  // array of measures by the order of `measureTypes` and `dates`
  readonly measurePerTypeAndDate: number[][]
}
