import { metricCalculatorByType, SnapshotContext } from '@covidtop/calculator/lib/metric'
import { jhuGlobalLoader } from '@covidtop/data/lib/dataset/jhu'
import { dataManager } from '@covidtop/data/lib/manager'
import { MainData, MainRecord } from '@covidtop/shared/lib/dataset'
import { Location } from '@covidtop/shared/lib/location'
import { metricFormatByType, metricInfoByType, MetricType } from '@covidtop/shared/lib/metric'
import { compareBy } from '@covidtop/shared/lib/utils'
import { Injectable } from '@nestjs/common'
import stringSimilarity from 'string-similarity'

import { StatisticsParams } from './statistics-params'
import { StatisticsResult } from './statistics-result'

interface TopRecord {
  readonly mainRecord: MainRecord
  readonly value: number | undefined
}

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
      params.type === 'top' ? this.getTop(params, snapshotContext) : this.getSummary(params, snapshotContext)

    console.log(result.message)
    return result
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
      const topRecords: TopRecord[] = Object.values(
        mainData.mainRecordByLocationTypeAndCode[breakdownLocationType.code],
      )
        .filter((mainRecord) => {
          if (location.code === locationData.rootLocation.code) {
            return true
          }
          return mainRecord.locationCode.includes(location.code)
        })
        .map(
          (mainRecord): TopRecord => {
            const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
            const value = getSnapshot(mainRecord)
            return { mainRecord, value }
          },
        )
      topRecords.sort(
        compareBy<TopRecord>({
          getValue: ({ value }) => value,
          ascendingOrder: metricInfo.defaultAsc,
        }),
      )
      const { locationByCode } = locationData.locationRecordByType[breakdownLocationType.code]
      const inLocation: string = location.code === locationData.rootLocation.code ? ' ' : ` in ${location.name} `
      messageLines.push(
        `Top ${breakdownLocationType.name} of ${metricInfo.name}${inLocation}(${snapshotContext.currentDate})`,
        '',
        ...topRecords.slice(0, 10).map((topRecord, index) => {
          const topLocation = locationByCode[topRecord.mainRecord.locationCode]
          return `${index + 1}. ${topLocation.name}   ${metricFormat.apply(topRecord.value)}`
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
      `Summary of ${location.name} (${snapshotContext.currentDate})`,
      '',
      ...params.metricTypes.map((metricType) => {
        const metricInfo = metricInfoByType[metricType]
        const getSnapshot = metricCalculatorByType[metricType].getSnapshot(snapshotContext)
        const value = getSnapshot(mainRecord)
        const metricFormat = metricFormatByType[metricInfo.formatType || 'decimal']
        return `${metricInfo.name}: ${metricFormat.apply(value)}`
      }),
    ]
    return messageLinesForLocation
  }
}
