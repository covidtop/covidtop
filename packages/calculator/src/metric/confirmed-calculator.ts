import { MetricCalculator } from './metric-calculator'
import { getMetricValueBySingleMeasure } from './single-measure-metric'

export const confirmedCalculator: MetricCalculator = {
  metricType: 'confirmed',
  getValue: getMetricValueBySingleMeasure('confirmed'),
}
