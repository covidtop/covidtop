import axios from 'axios'
import config from 'config'

import { dataIo } from './data-io'

const CHART_URL: string = config.get('CHART_URL')

export type ChartConfig = any // eslint-disable-line
export type ChartDatasetConfig = any // eslint-disable-line

const generateChart = async (chartConfig: ChartConfig): Promise<string> => {
  const imageId = dataIo.hash(chartConfig)
  const response = await axios.post(
    CHART_URL,
    { c: chartConfig, bkg: 'white', w: 400, h: 300 },
    { responseType: 'stream' },
  )
  return dataIo.downloadChart(imageId, response)
}

export const chartManager = {
  generateChart,
}
