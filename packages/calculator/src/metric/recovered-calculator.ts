import { MetricCalculator } from './metric-calculator'
import { getMetricValueBySingleMeasure } from './single-measure-metric'

export const recoveredCalculator: MetricCalculator = {
  metricType: 'recovered',
  getValue: getMetricValueBySingleMeasure('recovered'),
}
