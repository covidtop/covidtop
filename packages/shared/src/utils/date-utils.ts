import { differenceInMinutes, eachDayOfInterval, format, formatDistance, parse as parseDate, sub } from 'date-fns'

export { parseDate }

export const getNowText = (): string => {
  return new Date().toISOString()
}

export const toDateText = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const getDatesBetween = (startDateText: string, endDateText: string): string[] => {
  return eachDayOfInterval({ start: new Date(startDateText), end: new Date(endDateText) }).map(toDateText)
}

export const getMinutesBetween = (fromDate: Date, toDate: Date): number => {
  return differenceInMinutes(fromDate, toDate)
}

export const subtractDate = (dateText: string, days: number): string => {
  return toDateText(sub(new Date(dateText), { days }))
}

export const getDistanceBetween = (fromDate: Date, toDate: Date): string => {
  return formatDistance(fromDate, toDate, { addSuffix: true })
}
