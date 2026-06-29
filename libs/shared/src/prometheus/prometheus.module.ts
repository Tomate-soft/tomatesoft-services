import { DynamicModule, Global } from '@nestjs/common';
import { PrometheusConfig } from './config/prometheus.config';
import { PROMETHEUS_REGISTRY } from './providers.tokens';

export interface PrometheusConfigOptions {
  prefix?: string;
  defaultLabels?: Record<string, string>;
}

@Global()
export class PrometheusModule {
  static register(options: PrometheusConfigOptions = {}): DynamicModule {
    const register = PrometheusConfig.getConfig(options);
    return {
      module: PrometheusModule,
      providers: [
        {
          provide: PROMETHEUS_REGISTRY,
          useValue: register,
        },
      ],
      exports: [PROMETHEUS_REGISTRY],
    };
  }
}
