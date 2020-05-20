import { MetricCalculator } from './metric-calculator'
import { getMetricValueBySingleMeasure } from './single-measure-metric'

export const deathsCalculator: MetricCalculator = {
  metricType: 'deaths',
  getValue: getMetricValueBySingleMeasure('deaths'),
}
