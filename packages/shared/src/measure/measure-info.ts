import { mapValues } from '../utils'
import { MeasureType } from './measure-type'

export interface MeasureInfo {
  readonly measureType: MeasureType
  readonly name: string
}

const partialMeasureInfoByType: Readonly<Record<MeasureType, Omit<MeasureInfo, 'measureType'>>> = {
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

export const measureInfoByType: Readonly<Record<MeasureType, MeasureInfo>> = mapValues(
  partialMeasureInfoByType,
  (partialMeasureInfo, measureType) => ({
    measureType,
    ...partialMeasureInfo,
  }),
)
