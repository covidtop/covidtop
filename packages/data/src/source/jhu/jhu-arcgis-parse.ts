import { arcgisApi } from '../common'

const JHU_ARCGIS_BASE_URL = 'https://services9.arcgis.com/N9p5hsImWXAccRNI'
const JHU_ARCGIS_FOLDER = 'Nc2JKvYFoAEOFCG5JSI6'

export const parseJhuArcgisAdmin2 = async (countryRegion: string) => {
  return arcgisApi.getFeatures(JHU_ARCGIS_BASE_URL, JHU_ARCGIS_FOLDER, '1', `Country_Region = '${countryRegion}'`)
}

export const parseJhuArcgisCountryRegion = async () => {
  return arcgisApi.getFeatures(JHU_ARCGIS_BASE_URL, JHU_ARCGIS_FOLDER, '2')
}

export const parseJhuArcgisProvinceState = async () => {
  return arcgisApi.getFeatures(JHU_ARCGIS_BASE_URL, JHU_ARCGIS_FOLDER, '3')
}
