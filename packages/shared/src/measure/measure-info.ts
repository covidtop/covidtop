import { keyBy } from '../utils'
import { MeasureType } from './measure-type'

export interface MeasureInfo {
  readonly measureType: MeasureType
  readonly name: string
}

export const measureInfoByType = keyBy<MeasureInfo, MeasureType>(
  [
    {
      measureType: 'confirmed',
      name: 'Confirmed Cases',
    },
    {
      measureType: 'deaths',
      name: 'Deaths',
    },
    {
      measureType: 'recovered',
      name: 'Recovered Cases',
    },
  ],
  ({ measureType }) => measureType,
)
