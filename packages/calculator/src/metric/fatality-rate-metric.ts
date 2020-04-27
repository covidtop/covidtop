import { getRatio } from './common-metric'
import { getTotalConfirmedValueSnapshot } from './confirmed-metric'
import { getTotalDeathsValueSnapshot } from './deaths-metric'
import { CalculateSnapshot, SnapshotContext } from './snapshot-context'

export const getFatalityRateValueSnapshot: CalculateSnapshot = (context: SnapshotContext) => {
  const getTotalConfirmedValue = getTotalConfirmedValueSnapshot(context)
  const getTotalDeathsValue = getTotalDeathsValueSnapshot(context)

  return (mainRecord) => {
    const totalConfirmed = getTotalConfirmedValue(mainRecord)

    if (!totalConfirmed) {
      return 0
    }

    return getRatio(getTotalDeathsValue(mainRecord) || 0, totalConfirmed)
  }
}
