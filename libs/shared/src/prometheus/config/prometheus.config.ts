import type { Registry } from 'prom-client';
import * as client from 'prom-client';
import { PrometheusConfigOptions } from '../prometheus.module';

export class PrometheusConfig {
  static getConfig(options: PrometheusConfigOptions): Registry {
    const register = new client.Registry();

    if (options.defaultLabels) {
      register.setDefaultLabels(options.defaultLabels);
    }

    client.collectDefaultMetrics({ register, prefix: options.prefix });

    return register;
  }
}
