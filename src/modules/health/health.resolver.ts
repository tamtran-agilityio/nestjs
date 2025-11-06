import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Query(() => 'HealthStatus')
  @HealthCheck()
  async healthCheck() {
    const result = await this.health.check([]);
    return JSON.stringify(result);
  }

  @Query(() => 'HealthConnectionDBStatus')
  @HealthCheck()
  async healthCheckDB() {
    const result = await this.health.check([
      () => this.db.pingCheck('database'),
    ]);
    return JSON.stringify(result);
  }
}
