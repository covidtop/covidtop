import { eachDayOfInterval, format, sub } from 'date-fns'

export const getNowText = (): string => {
  return new Date().toISOString()
}

export const toDateText = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const getDatesBetween = (minDate: string, maxDate: string): string[] => {
  return eachDayOfInterval({ start: new Date(minDate), end: new Date(maxDate) }).map(toDateText)
}

export const subtractDate = (date: string, days: number): string => {
  return toDateText(sub(new Date(date), { days }))
}
