export type AllTimePeriod = { readonly type: 'all' }

export type LastNthDayTimePeriod = { readonly type: 'last-nth-day'; readonly lastNthDay: number }

export type SinceNthCaseTimePeriod = { readonly type: 'since-nth-case'; readonly sinceNthCase: number }

export type TimePeriod = AllTimePeriod | LastNthDayTimePeriod | SinceNthCaseTimePeriod
