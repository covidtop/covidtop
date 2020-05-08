import { baseCalculator, BaseRecord } from '@covidtop/calculator/lib/base'
import { metricCalculatorByType, SnapshotContext } from '@covidtop/calculator/lib/metric'
import { ChartConfig, ChartDatasetConfig, chartManager, dataManager } from '@covidtop/data/lib/manager'
import { globalLoader } from '@covidtop/data/lib/topic/global'
import { Location } from '@covidtop/shared/lib/location'
import { metricByType, metricFormatByType, MetricType } from '@covidtop/shared/lib/metric'
import { TopicData } from '@covidtop/shared/lib/topic'
import { compareBy } from '@covidtop/shared/lib/utils'
import { Injectable } from '@nestjs/common'
import config from 'config'
import stringSimilarity from 'string-similarity'

import { StatisticsParams } from './statistics-params'
import { StatisticsResult } from './statistics-result'

const HOST_URL: string = config.get('HOST_URL')

interface TopRecord {
  readonly baseRecord: BaseRecord
  readonly location: Location
  readonly value: number | undefined
}

const colors: string[] = ['#3869B1', '#DA7E30', '#3F9852', '#CC2428', '#535055', '#6B4C9A', '#958738']

@Injectable()
export class ChatService {
  async getStatistics (params: StatisticsParams): Promise<StatisticsResult | undefined> {
    const topicData: TopicData | undefined = await dataManager.getTopicData(globalLoader)

    if (!topicData) {
      return
    }

    const currentDate = topicData.dates[topicData.dates.length - 1]
    const snapshotContext: SnapshotContext = {
      metricContext: {
        topicData,
        topicConfig: globalLoader.topicConfig,
      },
      currentDate,
    }

    const result =
      params.type === 'top'
        ? this.getTop(params, snapshotContext)
        : params.type === 'trend'
          ? await this.getTrend(params, snapshotContext)
          : this.getSummary(params, snapshotContext)

    return result
  }

  private async getTrend (params: StatisticsParams, snapshotContext: SnapshotContext): Promise<StatisticsResult> {
    const metricType: MetricType = params.metricTypes[0]
    const metric = metricByType[metricType]
    const { topicData, topicConfig } = snapshotContext.metricContext

    const topRecords = params.locationQueries.reduce((currentTopRecords: TopRecord[], locationQuery) => {
      const location = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!location) {
        return currentTopRecords
      }

      const breakdownLocationType =
        topicConfig.locationConfig.locationTypes.find((locationType) => {
          return locationType.code === params.breakdownLocationTypeCode
        }) || topicConfig.locationConfig.locationTypes[0]

      const breakdownLocationGroup = topicData.locationGroups.filter(
        ({ locationType }) => locationType.code === breakdownLocationType.code,
      )[0]
      const baseRecords = baseCalculator.getBaseRecords(topicData, {
        filter: {
          locationTypeCode: location.type,
          locationCodes: [location.code],
        },
        group: {
          locationTypeCode: breakdownLocationType.code,
        },
      })

      const topRecords: TopRecord[] = baseRecords.map(
        (baseRecord: BaseRecord): TopRecord => {
          const location = breakdownLocationGroup.locationByCode[baseRecord.locationCode]
          const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
          const value = getSnapshot(baseRecord)
          return { baseRecord, location, value }
        },
      )

      currentTopRecords.push(...topRecords)

      return currentTopRecords
    }, [])

    topRecords.sort(
      compareBy<TopRecord>({
        getValue: ({ value }) => value,
        ascendingOrder: metric.defaultAsc,
      }),
    )

    const chartConfig: ChartConfig = {
      type: 'line',
      data: {
        labels: topicData.dates,
        datasets: topRecords.slice(0, 7).map((topRecord, index) => {
          const color = colors[index % colors.length]
          return {
            label: topRecord.location.name,
            fill: false,
            backgroundColor: color,
            borderColor: color,
            data: topicData.dates.map((date) => {
              const getSnapshot = metricCalculatorByType[metricType].getSnapshot({
                ...snapshotContext,
                currentDate: date,
              })
              return getSnapshot(topRecord.baseRecord)
            }),
          }
        }),
      },
    }

    const chartShortPath = await chartManager.generateChart(chartConfig)

    return {
      message: `${metric.name} of ${chartConfig.data.datasets
        .map(({ label }: ChartDatasetConfig) => label)
        .join(', ')}`,
      imageUrl: `${HOST_URL}/api/data/${chartShortPath}`,
    }
  }

  private getTop (params: StatisticsParams, snapshotContext: SnapshotContext): StatisticsResult {
    const messageLines: string[] = []
    const metricType: MetricType = params.metricTypes[0]
    const metricInfo = metricByType[metricType]
    const metricFormat = metricFormatByType[metricInfo.formatType || 'decimal']
    const { topicData, topicConfig } = snapshotContext.metricContext

    params.locationQueries.find((locationQuery) => {
      const location = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!location) {
        return false
      }

      const breakdownLocationType =
        topicConfig.locationConfig.locationTypes.find((locationType) => {
          return locationType.code === params.breakdownLocationTypeCode
        }) || topicConfig.locationConfig.locationTypes[0]

      const breakdownLocationGroup = topicData.locationGroups.filter(
        ({ locationType }) => locationType.code === breakdownLocationType.code,
      )[0]
      const baseRecords = baseCalculator.getBaseRecords(topicData, {
        filter: {
          locationTypeCode: location.type,
          locationCodes: [location.code],
        },
        group: {
          locationTypeCode: breakdownLocationType.code,
        },
      })

      const topRecords: TopRecord[] = baseRecords.map(
        (baseRecord: BaseRecord): TopRecord => {
          const location = breakdownLocationGroup.locationByCode[baseRecord.locationCode]
          const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
          const value = getSnapshot(baseRecord)
          return { baseRecord, location, value }
        },
      )
      topRecords.sort(
        compareBy<TopRecord>({
          getValue: ({ value }) => value,
          ascendingOrder: metricInfo.defaultAsc,
        }),
      )
      const inLocation: string = location.code === topicData.rootLocation.code ? ' ' : ` in ${location.name} `
      messageLines.push(
        `Top ${breakdownLocationType.name} of ${metricInfo.name}${inLocation}(*${snapshotContext.currentDate}*)`,
        '',
        ...topRecords.slice(0, 10).map((topRecord, index) => {
          return `${index + 1}. ${topRecord.location.name} *${metricFormat.apply(topRecord.value)}*`
        }),
        '',
      )
      return true
    })

    return { message: messageLines.join('\n') }
  }

  private getSummary (params: StatisticsParams, snapshotContext: SnapshotContext): StatisticsResult {
    const messageLines: string[] = []

    params.locationQueries.forEach((locationQuery, locationQueryIndex) => {
      if (locationQueryIndex > 0) {
        messageLines.push('---', '')
      }
      const location = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!location) {
        messageLines.push(`${locationQuery}: cannot find this location`)
      } else {
        messageLines.push(...this.getSummaryForLocation(location, snapshotContext, params))
      }
      messageLines.push('')
    })

    return { message: messageLines.join('\n') }
  }

  private findLocation (locationQuery: string, snapshotContext: SnapshotContext): Location | undefined {
    const { topicData } = snapshotContext.metricContext

    if (stringSimilarity.compareTwoStrings(locationQuery, topicData.rootLocation.name.toLowerCase()) > 0.8) {
      return topicData.rootLocation
    }

    for (const locationGroup of topicData.locationGroups) {
      let bestLocation: Location | undefined
      let bestSimilarity = 0
      Object.values(locationGroup.locationByCode).forEach((location) => {
        const similarity = stringSimilarity.compareTwoStrings(locationQuery, location.name.toLowerCase())
        if (similarity > 0.5 && similarity > bestSimilarity) {
          bestLocation = location
          bestSimilarity = similarity
        }
      })

      if (bestLocation) {
        return bestLocation
      }
    }

    return undefined
  }

  private getSummaryForLocation (
    location: Location,
    snapshotContext: SnapshotContext,
    params: StatisticsParams,
  ): string[] {
    const baseRecords = baseCalculator.getBaseRecords(snapshotContext.metricContext.topicData, {
      filter: {
        locationTypeCode: location.type,
        locationCodes: [location.code],
      },
      group: {
        locationTypeCode: location.type,
      },
    })
    const messageLinesForLocation = [
      `Summary of ${location.name} (*${snapshotContext.currentDate}*)`,
      '',
      ...params.metricTypes.map((metricType) => {
        const metric = metricByType[metricType]
        const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
        const value = getSnapshot(baseRecords[0])
        const metricFormat = metricFormatByType[metric.formatType || 'decimal']
        return `${metric.name}: *${metricFormat.apply(value)}*`
      }),
    ]
    return messageLinesForLocation
  }
}
