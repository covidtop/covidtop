import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import fse, { ReadStream } from 'fs-extra'
import path from 'path'

type AnyBody = any // eslint-disable-line

const request = <T>(options?: AxiosRequestConfig): AxiosPromise<T> => {
  return axios({
    method: options && typeof options.data !== 'undefined' ? 'POST' : 'GET',
    ...options,
  })
}

const getJson = async <T, B = AnyBody>(url: string, body?: B): Promise<T> => {
  return (await request<T>({ url, data: body })).data
}

const getText = async <B = AnyBody>(url: string, body?: B): Promise<string> => {
  return (await request<string>({ url, data: body, responseType: 'text' })).data
}

const downloadFile = async <B = AnyBody>(filePath: string, url: string, body?: B): Promise<void> => {
  await fse.ensureDir(path.dirname(filePath))
  const writer = fse.createWriteStream(filePath)

  const reader = (await request<ReadStream>({ url, data: body, responseType: 'stream' })).data
  reader.pipe(writer)

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export const downloader = {
  getJson,
  getText,
  downloadFile,
}
