import { LastNthDayTimePeriod, SinceNthCaseTimePeriod } from '@covidtop/shared/lib/params'

import { BaseRecord } from '../base'
import { confirmedCalculator } from './confirmed-calculator'
import { MetricContext } from './metric-context'

export interface TimePeriodResolver {
  readonly getStartDateIndex: (endDateIndex: number, baseRecord: BaseRecord) => number | undefined
}

const getAllTimePeriodResolver = (): TimePeriodResolver => {
  return {
    getStartDateIndex: () => 0,
  }
}

const getLastNthDayTimePeriodResolver = ({ lastNthDay }: LastNthDayTimePeriod): TimePeriodResolver => {
  return {
    getStartDateIndex: (endDateIndex: number) => endDateIndex + 1 - lastNthDay,
  }
}

const getSinceNthCasePeriodResolver = (
  { sinceNthCase }: SinceNthCaseTimePeriod,
  { metricParams, topicConfig, topicData }: MetricContext,
): TimePeriodResolver => {
  return {
    getStartDateIndex: (endDateIndex: number, baseRecord: BaseRecord) => {
      const getConfirmedValue = confirmedCalculator.getValue({
        topicConfig,
        topicData,
        metricParams: { ...metricParams, timePeriod: { type: 'all' } },
      })
      let currentCase = 0
      for (let dateIndex = 0; dateIndex < endDateIndex; ++dateIndex) {
        currentCase += getConfirmedValue(baseRecord, dateIndex) || 0
        if (currentCase >= sinceNthCase) {
          return dateIndex + 1
        }
      }
      return undefined
    },
  }
}

export const getTimePeriodResolver = (metricContext: MetricContext): TimePeriodResolver => {
  const {
    metricParams: { timePeriod },
  } = metricContext
  if (timePeriod.type === 'all') {
    return getAllTimePeriodResolver()
  }
  if (timePeriod.type === 'last-nth-day') {
    return getLastNthDayTimePeriodResolver(timePeriod)
  }
  if (timePeriod.type === 'since-nth-case') {
    return getSinceNthCasePeriodResolver(timePeriod, metricContext)
  }
  throw new Error(`Unknown time period type: ${timePeriod.type}`)
}
