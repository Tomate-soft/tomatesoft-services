import { Controller, Get, Header, Inject } from '@nestjs/common';
import { PROMETHEUS_REGISTRY } from '@app/shared';
import type { Registry } from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor(
    @Inject(PROMETHEUS_REGISTRY) private readonly registry: Registry,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
