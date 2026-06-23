import { DynamicModule } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GrpcConfig } from './grpc.config';

export interface GrpcModuleOptions {
  name: string;
  url: string;
  package: string;
  protoPath: string;
}

export class GrpcModule {
  static register(options: GrpcModuleOptions): DynamicModule {
    const grpcOptions = GrpcConfig.getOptions(options);

    return {
      module: GrpcModule,
      providers: [
        {
          provide: options.name,
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.GRPC,
              options: grpcOptions.options,
            }),
        },
      ],
      exports: [options.name],
    };
  }
}
