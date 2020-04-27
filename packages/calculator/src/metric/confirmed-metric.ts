import { getNewValueSnapshot, getTotalValueSnapshot } from './single-measure-metric'

export const getNewConfirmedValueSnapshot = getNewValueSnapshot('confirmed')

export const getTotalConfirmedValueSnapshot = getTotalValueSnapshot('confirmed')
