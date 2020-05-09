import config from 'config'

import { downloader, objectHasher } from '../source/common'
import { dataIo } from './data-io'

const CHART_URL: string = config.get('CHART_URL')

export type ChartConfig = any // eslint-disable-line
export type ChartDatasetConfig = any // eslint-disable-line

const generateChart = async (chartConfig: ChartConfig): Promise<string> => {
  const imageId = objectHasher.hash(chartConfig)
  const { chartShortPath, chartFullPath } = dataIo.getChartPaths(imageId)

  await downloader.downloadFile(chartFullPath, CHART_URL, { c: chartConfig, bkg: 'white', w: 400, h: 300 })

  return chartShortPath
}

export const chartManager = {
  generateChart,
}
