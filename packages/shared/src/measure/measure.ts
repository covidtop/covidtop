import { mapValues } from '../utils'
import { MeasureType } from './measure-type'

export interface Measure {
  readonly type: MeasureType
  readonly name: string
}

const partialMeasureByType: Readonly<Record<MeasureType, Omit<Measure, 'type'>>> = {
  confirmed: {
    name: 'Confirmed Cases',
  },
  deaths: {
    name: 'Deaths',
  },
  recovered: {
    name: 'Recovered Cases',
  },
}

export const measureByType: Readonly<Record<MeasureType, Measure>> = mapValues(
  partialMeasureByType,
  (partialMeasure, type) => ({
    type,
    ...partialMeasure,
  }),
)
