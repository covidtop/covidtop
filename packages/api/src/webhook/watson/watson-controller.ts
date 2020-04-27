import { MetricType } from '@covidtop/shared/lib/metric'
import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'

import { ChatService, StatisticsResult, StatisticsType } from '../chat'
import { WatsonRequest } from './watson-request'

// TODO reduce complexity
@Controller('webhook/watson')
export class WatsonController {
  constructor (private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getStatistics (@Body() body: WatsonRequest): Promise<StatisticsResult> {
    const response: StatisticsResult | undefined = await this.chatService.getStatistics({
      type: this.getQueryType(body.type),
      metricTypes: this.getMetricTypes(body.metrics),
      locationQueries: body.locations ? body.locations.map(({ value }) => value) : ['Global'],
      breakdownLocationTypeCode: body.breakdownLevel,
    })

    if (!response) {
      throw new InternalServerErrorException('Failed to get statistics')
    }

    return response
  }

  private getQueryType (type?: string): StatisticsType {
    if (type) {
      if (type.toLowerCase() === 'trend') {
        return 'trend'
      }
      if (type.toLowerCase() === 'top') {
        return 'top'
      }
    }
    return 'summary'
  }

  private getMetricTypes (metrics?: string[]): MetricType[] {
    const metricTypes: MetricType[] = []
    if (!metrics || metrics.includes('confirmed cases')) {
      metricTypes.push('total-confirmed-value')
    }
    if (!metrics || metrics.includes('deaths')) {
      metricTypes.push('total-deaths-value')
    }
    if (!metrics || metrics.includes('recovered cases')) {
      metricTypes.push('total-recovered-value')
    }
    if (!metrics || metrics.includes('active cases')) {
      metricTypes.push('total-active-value')
    }
    if (!metrics || metrics.includes('fatality rate')) {
      metricTypes.push('fatality-rate-value')
    }
    if (!metrics || metrics.includes('confirmed cases')) {
      metricTypes.push('new-confirmed-value')
    }
    if (!metrics || metrics.includes('deaths')) {
      metricTypes.push('new-deaths-value')
    }
    if (!metrics || metrics.includes('recovered cases')) {
      metricTypes.push('new-recovered-value')
    }
    return metricTypes
  }
}
