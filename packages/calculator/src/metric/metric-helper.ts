import roundTo from 'round-to'

const getRatio = (firstValue: number, secondValue: number): number | undefined => {
  if (secondValue === 0) {
    return
  }
  return roundTo(firstValue / secondValue, 10)
}

export const metricHelper = {
  roundTo,
  getRatio,
}
