import { Inject, Injectable } from '@nestjs/common';
import { PROMETHEUS_REGISTRY } from '@app/shared';
import { Registry, Counter, Histogram } from 'prom-client';

@Injectable()
export class PrometheusMetricsService {
  public readonly requestsCounter: Counter<string>;
  public readonly requestDuration: Histogram<string>;

  constructor(
    @Inject(PROMETHEUS_REGISTRY) private readonly registry: Registry,
  ) {
    this.requestsCounter = new Counter({
      name: 'tomatesoft_taunter_periods_requests_total',
      help: 'Total number of requests to the periods endpoint',
      registers: [this.registry],
    });

    this.requestDuration = new Histogram({
      name: 'tomatesoft_taunter_periods_request_duration_seconds',
      help: 'Duration of requests to the periods endpoint in seconds',
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
  }
}
