export interface MeasureGroupRecord {
  // array of location codes by the order of `MeasureGroup.locationTypeCodes`
  readonly locationCodePerType: string[]
  // array of measures by the order of `MeasureGroup.measureTypes` and `TopicData.dates`
  readonly measurePerTypeAndDate: number[][]
}
