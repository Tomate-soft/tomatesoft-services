import { GrpcModuleOptions } from './grpc.module';
import { Transport } from '@nestjs/microservices';

export class GrpcConfig {
  static getOptions(options: GrpcModuleOptions) {
    return {
      name: options.name,
      transport: Transport.GRPC,
      options: {
        url: options.url,
        package: options.package,
        protoPath: options.protoPath,
      },
    };
  }
}
