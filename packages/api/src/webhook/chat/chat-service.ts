import { metricCalculatorByType, SnapshotContext } from '@covidtop/calculator/lib/metric'
import { jhuGlobalLoader } from '@covidtop/data/lib/dataset/jhu'
import { dataManager } from '@covidtop/data/lib/manager'
import { MainData, MainRecord } from '@covidtop/shared/lib/dataset'
import { Location } from '@covidtop/shared/lib/location'
import { metricFormatByType, metricInfoByType, MetricType } from '@covidtop/shared/lib/metric'
import { compareBy } from '@covidtop/shared/lib/utils'
import { Injectable } from '@nestjs/common'
import config from 'config'
import download from 'download'
import createObjectHasher from 'node-object-hash'
import path from 'path'
import querystring from 'querystring'
import stringSimilarity from 'string-similarity'

import { StatisticsParams } from './statistics-params'
import { StatisticsResult } from './statistics-result'

const HOST_URL: string = config.get('HOST_URL')
const CHART_URL: string = config.get('CHART_URL')
const objectHasher = createObjectHasher()

interface TopRecord {
  readonly mainRecord: MainRecord
  readonly location: Location
  readonly value: number | undefined
}

type ChartConfig = any // eslint-disable-line
type ChartDatasetConfig = any // eslint-disable-line

const colors: string[] = ['#3869B1', '#DA7E30', '#3F9852', '#CC2428', '#535055', '#6B4C9A', '#958738']

@Injectable()
export class ChatService {
  async getStatistics (params: StatisticsParams): Promise<StatisticsResult | undefined> {
    const mainData: MainData | undefined = await dataManager.getMainData(jhuGlobalLoader)

    if (!mainData) {
      return
    }

    const currentDate = mainData.referenceData.dates[mainData.referenceData.dates.length - 1]
    const snapshotContext: SnapshotContext = {
      metricContext: {
        mainData,
        datasetConfig: jhuGlobalLoader.datasetConfig,
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
    const metricInfo = metricInfoByType[metricType]
    const { mainData, datasetConfig } = snapshotContext.metricContext

    const topRecords = params.locationQueries.reduce((currentTopRecords: TopRecord[], locationQuery) => {
      const foundLocation = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!foundLocation) {
        return currentTopRecords
      }
      const { locationData } = mainData.referenceData
      const breakdownLocationType =
        datasetConfig.locationConfig.locationTypes.find((locationType) => {
          return locationType.code === params.breakdownLocationTypeCode
        }) || datasetConfig.locationConfig.locationTypes[0]
      const { location } = foundLocation
      const { locationByCode } = locationData.locationRecordByType[breakdownLocationType.code]
      const topRecords: TopRecord[] = Object.values(
        mainData.mainRecordByLocationTypeAndCode[breakdownLocationType.code],
      )
        .filter((mainRecord) => {
          if (location.code === locationData.rootLocation.code) {
            return true
          }
          return mainRecord.locationCode === location.code || mainRecord.locationCode.startsWith(`${location.code}-`)
        })
        .map(
          (mainRecord): TopRecord => {
            const location = locationByCode[mainRecord.locationCode]
            const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
            const value = getSnapshot(mainRecord)
            return { mainRecord, location, value }
          },
        )

      currentTopRecords.push(...topRecords)

      return currentTopRecords
    }, [])

    topRecords.sort(
      compareBy<TopRecord>({
        getValue: ({ value }) => value,
        ascendingOrder: metricInfo.defaultAsc,
      }),
    )

    const chartConfig: ChartConfig = {
      type: 'line',
      data: {
        labels: mainData.referenceData.dates,
        datasets: topRecords.slice(0, 7).map((topRecord, index) => {
          const color = colors[index % colors.length]
          return {
            label: topRecord.location.name,
            fill: false,
            backgroundColor: color,
            borderColor: color,
            data: mainData.referenceData.dates.map((date) => {
              const getSnapshot = metricCalculatorByType[metricType].getSnapshot({
                ...snapshotContext,
                currentDate: date,
              })
              return getSnapshot(topRecord.mainRecord)
            }),
          }
        }),
      },
    }

    const imageId = objectHasher.hash(chartConfig)

    await download(
      `${CHART_URL}?bkg=white&w=400&h=300&c=${querystring.escape(JSON.stringify(chartConfig))}`,
      path.join(__dirname, `../../../../../data/${process.env.NODE_ENV}/chart`),
      { filename: `${imageId}.png` },
    )

    return {
      message: `${metricInfo.name} of ${chartConfig.data.datasets
        .map(({ label }: ChartDatasetConfig) => label)
        .join(', ')}`,
      imageUrl: `${HOST_URL}/api/data/chart/${imageId}.png`,
    }
  }

  private getTop (params: StatisticsParams, snapshotContext: SnapshotContext): StatisticsResult {
    const messageLines: string[] = []
    const metricType: MetricType = params.metricTypes[0]
    const metricInfo = metricInfoByType[metricType]
    const metricFormat = metricFormatByType[metricInfo.formatType || 'decimal']

    params.locationQueries.find((locationQuery) => {
      const foundLocation = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!foundLocation) {
        return false
      }
      const { mainData, datasetConfig } = snapshotContext.metricContext
      const { locationData } = mainData.referenceData
      const breakdownLocationType =
        datasetConfig.locationConfig.locationTypes.find((locationType) => {
          return locationType.code === params.breakdownLocationTypeCode
        }) || datasetConfig.locationConfig.locationTypes[0]
      const { location } = foundLocation
      const { locationByCode } = locationData.locationRecordByType[breakdownLocationType.code]
      const topRecords: TopRecord[] = Object.values(
        mainData.mainRecordByLocationTypeAndCode[breakdownLocationType.code],
      )
        .filter((mainRecord) => {
          if (location.code === locationData.rootLocation.code) {
            return true
          }
          return mainRecord.locationCode === location.code || mainRecord.locationCode.startsWith(`${location.code}-`)
        })
        .map(
          (mainRecord): TopRecord => {
            const location = locationByCode[mainRecord.locationCode]
            const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
            const value = getSnapshot(mainRecord)
            return { mainRecord, location, value }
          },
        )
      topRecords.sort(
        compareBy<TopRecord>({
          getValue: ({ value }) => value,
          ascendingOrder: metricInfo.defaultAsc,
        }),
      )
      const inLocation: string = location.code === locationData.rootLocation.code ? ' ' : ` in ${location.name} `
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

    params.locationQueries.forEach((locationQuery) => {
      messageLines.push('---', '')
      const foundLocation = this.findLocation(locationQuery.toLowerCase(), snapshotContext)
      if (!foundLocation) {
        messageLines.push(`${locationQuery}: cannot find this location`)
      } else {
        const { location, mainRecord } = foundLocation
        messageLines.push(...this.getSummaryStatisticsForRecord(location, mainRecord, snapshotContext, params))
      }
      messageLines.push('')
    })
    messageLines.push('---')

    return { message: messageLines.join('\n') }
  }

  private findLocation (locationQuery: string, snapshotContext: SnapshotContext) {
    const { mainData, datasetConfig } = snapshotContext.metricContext
    const { locationData } = mainData.referenceData

    if (stringSimilarity.compareTwoStrings(locationQuery, locationData.rootLocation.name.toLowerCase()) > 0.8) {
      return { location: locationData.rootLocation, mainRecord: mainData.rootRecord }
    }

    for (const locationType of datasetConfig.locationConfig.locationTypes) {
      const { locationByCode } = locationData.locationRecordByType[locationType.code]

      let bestLocation: Location | undefined
      let bestSimilarity = 0
      Object.values(locationByCode).forEach((location) => {
        const similarity = stringSimilarity.compareTwoStrings(locationQuery, location.name.toLowerCase())
        if (similarity > 0.5 && similarity > bestSimilarity) {
          bestLocation = location
          bestSimilarity = similarity
        }
      })

      if (bestLocation) {
        const mainRecordByLocationCode = mainData.mainRecordByLocationTypeAndCode[locationType.code]
        return { location: bestLocation, mainRecord: mainRecordByLocationCode[bestLocation.code] }
      }
    }

    return undefined
  }

  private getSummaryStatisticsForRecord (
    location: Location,
    mainRecord: MainRecord,
    snapshotContext: SnapshotContext,
    params: StatisticsParams,
  ): string[] {
    const messageLinesForLocation = [
      `Summary of ${location.name} (*${snapshotContext.currentDate}*)`,
      '',
      ...params.metricTypes.map((metricType) => {
        const metricInfo = metricInfoByType[metricType]
        const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
        const value = getSnapshot(mainRecord)
        const metricFormat = metricFormatByType[metricInfo.formatType || 'decimal']
        return `${metricInfo.name}: *${metricFormat.apply(value)}*`
      }),
    ]
    return messageLinesForLocation
  }
}
