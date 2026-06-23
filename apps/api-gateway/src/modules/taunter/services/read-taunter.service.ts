import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

interface TaunterServiceClient {
  getPeriodsByMonth(data: { month: string }): Observable<any>;
}

@Injectable()
export class ReadTaunterService implements OnModuleInit {
  private taunterService: TaunterServiceClient;

  constructor(
    @Inject('TAUNTER_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.taunterService =
      this.grpcClient.getService<TaunterServiceClient>('TaunterService');
  }

  async getPeriodsByMonth(month: string): Promise<any> {
    const response = await firstValueFrom(
      this.taunterService.getPeriodsByMonth({ month }),
    );
    return response.periods;
  }
}
