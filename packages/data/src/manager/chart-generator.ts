import axios from 'axios'
import config from 'config'
import fs from 'fs'
import createObjectHasher from 'node-object-hash'
import path from 'path'

const objectHasher = createObjectHasher()
const CHART_URL: string = config.get('CHART_URL')

export type ChartConfig = any // eslint-disable-line
export type ChartDatasetConfig = any // eslint-disable-line

const downloadImage = async (chartConfig: ChartConfig): Promise<string> => {
  const imageId = objectHasher.hash(chartConfig)
  const imagePath = path.join(__dirname, `../../../../data/${process.env.NODE_ENV}/chart/${imageId}.png`)
  const response = await axios.post(
    CHART_URL,
    { c: chartConfig, bkg: 'white', w: 400, h: 300 },
    { responseType: 'stream' },
  )
  const writer = fs.createWriteStream(imagePath)
  response.data.pipe(writer)
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
  return imageId
}

export const chartGenerator = {
  downloadImage,
}
