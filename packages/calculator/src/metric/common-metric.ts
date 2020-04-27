import roundTo from 'round-to'

export const getRatio = (firstValue: number, secondValue: number): number | undefined => {
  if (secondValue === 0) {
    return
  }
  return roundTo(firstValue / secondValue, 6)
}
