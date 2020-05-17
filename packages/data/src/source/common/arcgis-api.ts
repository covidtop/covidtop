import 'isomorphic-fetch'
import 'isomorphic-form-data'

import { IFeature, queryFeatures } from '@esri/arcgis-rest-feature-layer'

export type ArcgisFeature = IFeature

interface GetNextFeaturesOptions {
  readonly url: string
  readonly where: string
  readonly limit: number
  readonly offset: number
}

const getNextFeatures = async ({ url, where, limit, offset }: GetNextFeaturesOptions): Promise<ArcgisFeature[]> => {
  const response = await queryFeatures({
    url,
    where,
    params: {
      f: 'json',
      returnGeometry: false,
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      resultRecordCount: limit,
      resultOffset: offset,
    },
  })

  if ('features' in response) {
    return response.features
  }

  return []
}

const getFeatures = async (
  baseUrl: string,
  folder: string,
  serviceType: string,
  condition = '1=1',
): Promise<ArcgisFeature[]> => {
  const url = `${baseUrl}/arcgis/rest/services/${folder}/FeatureServer/${serviceType}`
  let options: GetNextFeaturesOptions = {
    url,
    where: condition,
    limit: 1000,
    offset: 0,
  }

  const features: ArcgisFeature[] = []
  while (true) {
    const nextFeatures = await getNextFeatures(options)
    if (!nextFeatures || !nextFeatures.length) {
      break
    }

    features.push(...nextFeatures)

    options = {
      ...options,
      offset: options.offset + options.limit,
    }
  }

  return features
}

export const arcgisApi = {
  getFeatures,
}
