import { IFeature, IQueryFeaturesResponse, queryFeatures } from '@esri/arcgis-rest-feature-layer'
require('isomorphic-fetch')
require('isomorphic-form-data')

const baseUrl = 'https://services9.arcgis.com'

export interface ArcgisQuery {
  readonly outFields: string
  readonly where?: string
  readonly limit?: number
  offset?: number
}

const fetchContent = async (
  url: string,
  { outFields, where, offset, limit }: ArcgisQuery,
): Promise<IQueryFeaturesResponse> => {
  const result = (await queryFeatures({
    url,
    where: where || '1=1',
    params: {
      f: 'json',
      returnGeometry: false,
      spatialRel: 'esriSpatialRelIntersects',
      outFields,
      resultOffset: offset,
      resultRecordCount: limit,
    },
  })) as IQueryFeaturesResponse
  return result
}

const getContent = async (
  site: string,
  folder: string,
  serviceName: string,
  serviceType: string,
  query: ArcgisQuery,
): Promise<IFeature[]> => {
  const url = `${baseUrl}/${site}/arcgis/rest/services/${folder}/${serviceName}/${serviceType}`
  const results: IFeature[] = []
  const actualQuery: ArcgisQuery = {
    offset: 0,
    limit: 1000,
    ...query,
  }
  while (true) {
    const response = await fetchContent(url, actualQuery)
    if (response.features && response.features.length === 0) break
    results.push(...response.features)
    actualQuery.offset = (actualQuery.offset || 0) + (actualQuery.limit || 1000)
  }
  return results
}

export const arcgisApi = {
  getContent,
}
