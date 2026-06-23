import { DynamicModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
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
      imports: [ClientsModule.register([grpcOptions as any])],
      exports: [options.name],
    };
  }
}
