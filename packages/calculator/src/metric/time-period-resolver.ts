import { LastNthDayTimePeriod } from '@covidtop/shared/lib/params'

import { MetricContext } from './metric-context'

export interface TimePeriodResolver {
  readonly getStartDateIndex: (endDateIndex: number) => number
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
    // TODO
  }
  throw new Error(`Unknown time period type: ${timePeriod.type}`)
}
