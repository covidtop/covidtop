import { downloader } from './downloader'

interface CkanResource {
  readonly format: string
  readonly url: string
}

const getDatasetContent = async (baseUrl: string, datasetId: string, format: string): Promise<string> => {
  const { result } = await downloader.getJson(`${baseUrl}/data/api/action/package_show?id=${datasetId}`)
  const resource: CkanResource | undefined = result.resources.find((resource: CkanResource) => {
    return resource.format === format
  })
  if (!resource) {
    throw new Error(`No resource of format ${format} for dataset ${datasetId}`)
  }
  return downloader.getText(resource.url)
}

export const ckanApi = {
  getDatasetContent,
}
