export interface BaseRecord {
  readonly locationCode: string
  // array of measures by the order of `BaseData.measureTypes` and `TopicData.dates`
  readonly measurePerTypeAndDate: number[][]
}
