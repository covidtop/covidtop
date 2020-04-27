import { getTotalConfirmedValueSnapshot } from './confirmed-metric'
import { getTotalDeathsValueSnapshot } from './deaths-metric'
import { getTotalRecoveredValueSnapshot } from './recovered-metric'
import { CalculateSnapshot, SnapshotContext } from './snapshot-context'

export const getTotalActiveValueSnapshot: CalculateSnapshot = (context: SnapshotContext) => {
  const getTotalConfirmedValue = getTotalConfirmedValueSnapshot(context)
  const getTotalDeathsValue = getTotalDeathsValueSnapshot(context)
  const getTotalRecoveredValue = getTotalRecoveredValueSnapshot(context)

  return (mainRecord) => {
    return (
      (getTotalConfirmedValue(mainRecord) || 0) -
      (getTotalDeathsValue(mainRecord) || 0) -
      (getTotalRecoveredValue(mainRecord) || 0)
    )
  }
}
